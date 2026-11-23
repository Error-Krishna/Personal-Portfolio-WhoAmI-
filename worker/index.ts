interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  RESEND_API_KEY?: string;
  CONTACT_EMAIL_TO?: string;
  CONTACT_EMAIL_FROM?: string;
}

interface ContactInquiryPayload {
  name?: string;
  email?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-Id',
    'Access-Control-Max-Age': '86400',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // Health check endpoint: /api/v1/health or /api/health
    if (url.pathname === '/api/v1/health' || url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            status: 'ok',
            version: '1.0.0',
            environment: 'production',
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }

    // Contact form endpoint: POST /api/v1/contact or POST /api/contact
    if (
      (url.pathname === '/api/v1/contact' || url.pathname === '/api/contact') &&
      request.method === 'POST'
    ) {
      let body: ContactInquiryPayload;
      try {
        body = (await request.json()) as ContactInquiryPayload;
      } catch {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: 'INVALID_JSON',
              message: 'Invalid JSON payload received.',
            },
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin),
            },
          }
        );
      }

      const name = body.name?.trim();
      const email = body.email?.trim();
      const message = body.message?.trim();
      const service = body.service?.trim() || 'General Inquiry';
      const budget = body.budget?.trim() || 'Not specified';

      // Basic validation
      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Name, email, and message are required fields.',
            },
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin),
            },
          }
        );
      }

      // Check if Resend API key is configured (check both env and process.env)
      const apiKey =
        env.RESEND_API_KEY ||
        (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined);

      if (!apiKey) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: 'SERVICE_UNAVAILABLE',
              message:
                'Email delivery service is currently not configured on this server. Please use direct email to reach Krishna directly.',
            },
          }),
          {
            status: 503,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin),
            },
          }
        );
      }

      const toEmail =
        env.CONTACT_EMAIL_TO ||
        (typeof process !== 'undefined' ? process.env?.CONTACT_EMAIL_TO : undefined) ||
        'iamkrishnagoyal@gmail.com';
      const fromEmail =
        env.CONTACT_EMAIL_FROM ||
        (typeof process !== 'undefined' ? process.env?.CONTACT_EMAIL_FROM : undefined) ||
        'Krishna Goyal Portfolio <onboarding@resend.dev>';
      const subject = `[Portfolio Inquiry] ${service} - from ${name}`;

      const textContent = [
        'NEW PROJECT INQUIRY FROM PORTFOLIO',
        '==================================',
        `Name: ${name}`,
        `Email: ${email}`,
        `Service: ${service}`,
        `Budget: ${budget}`,
        `Submitted At: ${new Date().toISOString()}`,
        '',
        'Project Description:',
        '--------------------',
        message,
      ].join('\n');

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Inquiry</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0c0d12; color: #ffffff; padding: 24px 32px;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; text-transform: uppercase;">
        New Project Inquiry
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8; font-family: monospace;">
        Krishna Goyal Portfolio · Inquiry Notification
      </p>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace; text-transform: uppercase; width: 120px;">Client Name</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace; text-transform: uppercase;">Email</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
            <a href="mailto:${escapeHtml(email)}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${escapeHtml(email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace; text-transform: uppercase;">Service</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${escapeHtml(service)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace; text-transform: uppercase;">Budget</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">${escapeHtml(budget)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace; text-transform: uppercase;">Received</td>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace;">${new Date().toUTCString()}</td>
        </tr>
      </table>

      <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 16px 20px; border-radius: 6px; margin-bottom: 28px;">
        <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #64748b; margin-bottom: 8px; font-weight: 700;">
          Project Overview & Message
        </div>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(`Re: Project Inquiry (${service})`)}"
           style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">
          Reply to ${escapeHtml(name)}
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Krishna-Goyal-Portfolio-Worker/1.0',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            reply_to: email,
            subject,
            text: textContent,
            html: htmlContent,
          }),
        });

        const resData = (await resendRes.json()) as { id?: string; message?: string };

        if (!resendRes.ok) {
          return new Response(
            JSON.stringify({
              success: false,
              error: {
                code: 'EMAIL_SEND_FAILED',
                message: resData.message || 'Failed to dispatch email via Resend provider.',
              },
            }),
            {
              status: resendRes.status,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders(origin),
              },
            }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              id: resData.id || `resend_${Date.now()}`,
              receivedAt: new Date().toISOString(),
              message: `Thank you ${name}, your project inquiry regarding "${service}" has been received!`,
              deliveryStatus: 'delivered',
              provider: 'resend',
            },
          }),
          {
            status: 201,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin),
            },
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: 'DISPATCH_ERROR',
              message: err instanceof Error ? err.message : 'Network error during email dispatch.',
            },
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin),
            },
          }
        );
      }
    }

    // Pass all other requests to the static assets handler
    return env.ASSETS.fetch(request);
  },
};
