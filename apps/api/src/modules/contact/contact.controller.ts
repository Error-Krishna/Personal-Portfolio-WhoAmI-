import type { Request, Response } from 'express';
import { sendSuccess } from '../../common/utils/response.js';
import type { ContactInquiry, ContactInquiryResponse } from '@portfolio/contracts';
import { EmailService } from './email.service.js';

export class ContactController {
  public static async submitInquiry(req: Request, res: Response): Promise<void> {
    const inquiry = req.body as ContactInquiry;

    // Dispatch email notification to portfolio owner
    const dispatchResult = await EmailService.sendContactEmail(inquiry);

    const receivedAt = new Date().toISOString();

    const responseData: ContactInquiryResponse = {
      id: dispatchResult.id,
      receivedAt,
      message: `Thank you ${inquiry.name}, your project inquiry regarding "${inquiry.service}" has been received!`,
      deliveryStatus: dispatchResult.deliveryStatus,
      provider: dispatchResult.provider,
    };

    sendSuccess(res, responseData, 201);
  }
}
