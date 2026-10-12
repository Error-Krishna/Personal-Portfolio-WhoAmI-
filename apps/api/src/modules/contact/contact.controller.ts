import type { Request, Response } from 'express';
import { sendSuccess } from '../../common/utils/response.js';
import type { ContactInquiry, ContactInquiryResponse } from '@portfolio/contracts';

export class ContactController {
  public static async submitInquiry(req: Request, res: Response): Promise<void> {
    const inquiry = req.body as ContactInquiry;

    // In production, this can send an email via SendGrid/SES or save to MongoDB
    // For now, log the structured inquiry and return a verified success envelope
    const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const receivedAt = new Date().toISOString();

    const responseData: ContactInquiryResponse = {
      id: inquiryId,
      receivedAt,
      message: `Thank you ${inquiry.name}, your project inquiry regarding "${inquiry.service}" has been received!`,
    };

    sendSuccess(res, responseData, 201);
  }
}
