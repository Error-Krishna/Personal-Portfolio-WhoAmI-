#!/usr/bin/env bash
set -o errexit

python3 manage.py migrate --noinput
python3 manage.py collectstatic --noinput
