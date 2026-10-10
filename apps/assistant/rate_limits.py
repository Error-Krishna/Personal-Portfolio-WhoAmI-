from hashlib import sha256

from django.core.cache import cache


REQUEST_LIMIT = 20
WINDOW_SECONDS = 60


def is_rate_limited(request) -> bool:
    client_ip = request.META.get("REMOTE_ADDR", "unknown")
    session_key = request.session.session_key or "no-session"
    fingerprint = sha256(f"{client_ip}:{session_key}".encode()).hexdigest()
    cache_key = f"assistant:chat:{fingerprint}"
    if cache.add(cache_key, 1, timeout=WINDOW_SECONDS):
        return False
    try:
        count = cache.incr(cache_key)
    except ValueError:
        cache.set(cache_key, 1, timeout=WINDOW_SECONDS)
        return False
    return count > REQUEST_LIMIT


ADMIN_LOGIN_LIMIT = 5
ADMIN_LOGIN_WINDOW_SECONDS = 15 * 60


def _admin_login_cache_key(request) -> str:
    client_ip = request.META.get("REMOTE_ADDR", "unknown")
    fingerprint = sha256(client_ip.encode()).hexdigest()
    return f"assistant:admin-login:{fingerprint}"


def is_admin_login_rate_limited(request) -> bool:
    return cache.get(_admin_login_cache_key(request), 0) >= ADMIN_LOGIN_LIMIT


def consume_admin_login_attempt(request) -> bool:
    """
    Atomically count a login attempt before password authentication.

    Returns False when the attempt exceeds the configured limit.
    The first increment establishes the fixed-window expiry; subsequent
    increments preserve it.
    """
    cache_key = _admin_login_cache_key(request)

    if cache.add(
        cache_key,
        1,
        timeout=ADMIN_LOGIN_WINDOW_SECONDS,
    ):
        return True

    # A key can expire between the initial add and increment. Retry
    # initialization in that case rather than resetting an existing counter.
    for _ in range(3):
        try:
            count = cache.incr(cache_key)
            return count <= ADMIN_LOGIN_LIMIT
        except ValueError:
            if cache.add(
                cache_key,
                1,
                timeout=ADMIN_LOGIN_WINDOW_SECONDS,
            ):
                return True

    # Fail closed if the counter cannot be updated consistently.
    return False


def clear_admin_login_attempts(request) -> None:
    cache.delete(_admin_login_cache_key(request))