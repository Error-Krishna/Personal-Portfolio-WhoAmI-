import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { AppError } from '../../common/errors/app-error.js';
import { HttpStatus } from '../../common/constants/http-status.js';
import { ErrorCode } from '@portfolio/contracts';
import type { ContactInquiry } from '@portfolio/contracts';

export interface EmailDispatchResult {
  id: string;
  provider: 'resend' | 'smtp' | 'mock';
  deliveryStatus: 'accepted' | 'delivered';
}

export class EmailService {
  /**
   * Dispatches a contact inquiry notification email to the portfolio owner.
   */
  public static async sendContactEmail(inquiry: ContactInquiry): Promise<EmailDispatchResult> {
    const toEmail = env.CONTACT_EMAIL_TO;
    const fromEmail = env.CONTACT_EMAIL_FROM;
    const subject = `[Portfolio Inquiry] ${inquiry.service} - from ${inquiry.name}`;

    const textContent = [
      `NEW PROJECT INQUIRY FROM PORTFOLIO`,
      `==================================`,
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Service: ${inquiry.service}`,
      inquiry.budget ? `Budget: ${inquiry.budget}` : null,
      `Submitted At: ${new Date().toISOString()}`,
      ``,
      `Project Description:`,
      `--------------------`,
      inquiry.message,
    ]
      .filter((line) => line !== null)
      .join('\n');

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
          <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${escapeHtml(inquiry.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace; text-transform: uppercase;">Email</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
            <a href="mailto:${escapeHtml(inquiry.email)}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${escapeHtml(inquiry.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace; text-transform: uppercase;">Service</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${escapeHtml(inquiry.service)}</td>
        </tr>
        ${
          inquiry.budget
            ? `<tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace; text-transform: uppercase;">Budget</td>
          <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">${escapeHtml(inquiry.budget)}</td>
        </tr>`
            : ''
        }
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace; text-transform: uppercase;">Received</td>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-family: monospace;">${new Date().toUTCString()}</td>
        </tr>
      </table>

      <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 16px 20px; border-radius: 6px; margin-bottom: 28px;">
        <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #64748b; margin-bottom: 8px; font-weight: 700;">
          Project Overview & Message
        </div>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${escapeHtml(inquiry.message)}</p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${escapeHtml(inquiry.email)}?subject=${encodeURIComponent(`Re: Project Inquiry (${inquiry.service})`)}"
           style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">
          Reply to ${escapeHtml(inquiry.name)}
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

    // 1. Resend API Dispatch (preferred for serverless / modern cloud)
    if (env.RESEND_API_KEY) {
      return this.sendViaResend({
        apiKey: env.RESEND_API_KEY,
        from: fromEmail,
        to: toEmail,
        replyTo: inquiry.email,
        subject,
        text: textContent,
        html: htmlContent,
      });
    }

    // 2. SMTP Transport (via Nodemailer)
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      return this.sendViaSmtp({
        from: fromEmail,
        to: toEmail,
        replyTo: inquiry.email,
        subject,
        text: textContent,
        html: htmlContent,
      });
    }

    // 3. Test Mode Mock Dispatch (allows CI / automated tests to pass without live credentials)
    if (env.NODE_ENV === 'test') {
      const mockId = `mock_inq_${Date.now()}`;
      logger.info('[EmailService] Mock dispatch in test environment', { id: mockId });
      return {
        id: mockId,
        provider: 'mock',
        deliveryStatus: 'accepted',
      };
    }

    // 4. No Provider Configured (Surface explicit error to prevent false success reports)
    logger.warn(
      '[EmailService] No email delivery credentials configured (RESEND_API_KEY or SMTP_HOST missing).'
    );
    throw new AppError(
      'Email delivery service is currently not configured on this server. Please use direct email to reach Krishna directly.',
      HttpStatus.SERVICE_UNAVAILABLE,
      ErrorCode.SERVICE_UNAVAILABLE
    );
  }

  /**
   * Send email using Resend REST API (Zero external SDK dependencies, fast & reliable).
   */
  private static async sendViaResend(params: {
    apiKey: string;
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<EmailDispatchResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${params.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Krishna-Goyal-Portfolio-API/1.0',
        },
        body: JSON.stringify({
          from: params.from,
          to: [params.to],
          reply_to: params.replyTo,
          subject: params.subject,
          text: params.text,
          html: params.html,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseBody = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok) {
        logger.error('[EmailService] Resend API rejected message', {
          status: response.status,
          error: responseBody,
        });
        const errorMsg =
          typeof responseBody.message === 'string'
            ? responseBody.message
            : 'Email provider rejected dispatch request';
        throw new AppError(
          `Email delivery provider error: ${errorMsg}`,
          HttpStatus.SERVICE_UNAVAILABLE,
          ErrorCode.SERVICE_UNAVAILABLE
        );
      }

      const id = typeof responseBody.id === 'string' ? responseBody.id : `resend_${Date.now()}`;
      logger.info('[EmailService] Message successfully accepted by Resend', { id });

      return {
        id,
        provider: 'resend',
        deliveryStatus: 'accepted',
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof AppError) throw err;

      const isTimeout =
        err instanceof Error && (err.name === 'AbortError' || err.message.includes('abort'));
      logger.error('[EmailService] Resend dispatch network error', {
        message: err instanceof Error ? err.message : String(err),
        isTimeout,
      });

      throw new AppError(
        isTimeout
          ? 'Email delivery request timed out after 8s.'
          : 'Failed to communicate with email delivery provider.',
        HttpStatus.SERVICE_UNAVAILABLE,
        ErrorCode.SERVICE_UNAVAILABLE
      );
    }
  }

  /**
   * Send email using standard SMTP via Nodemailer.
   */
  private static async sendViaSmtp(params: {
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<EmailDispatchResult> {
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        secure: env.SMTP_SECURE || false,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: params.from,
        to: params.to,
        replyTo: params.replyTo,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });

      logger.info('[EmailService] Message successfully dispatched via SMTP', {
        messageId: info.messageId,
      });

      return {
        id: info.messageId || `smtp_${Date.now()}`,
        provider: 'smtp',
        deliveryStatus: 'delivered',
      };
    } catch (err: unknown) {
      logger.error('[EmailService] SMTP delivery failed', {
        error: err instanceof Error ? err.message : String(err),
      });

      throw new AppError(
        'Failed to deliver email through SMTP gateway.',
        HttpStatus.SERVICE_UNAVAILABLE,
        ErrorCode.SERVICE_UNAVAILABLE
      );
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
