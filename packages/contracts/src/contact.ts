import { z } from 'zod';

export const ContactInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Please enter a valid email address'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters long').max(2000),
  budget: z.string().optional(),
});

export type ContactInquiry = z.infer<typeof ContactInquirySchema>;

export const ContactInquiryResponseSchema = z.object({
  id: z.string(),
  receivedAt: z.string(),
  message: z.string(),
});

export type ContactInquiryResponse = z.infer<typeof ContactInquiryResponseSchema>;
