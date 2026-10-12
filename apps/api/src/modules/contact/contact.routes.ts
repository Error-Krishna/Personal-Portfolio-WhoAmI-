import { Router } from 'express';
import { ContactController } from './contact.controller.js';
import { validateRequest } from '../../common/middleware/validate-request.js';
import { ContactInquirySchema } from '@portfolio/contracts';

const router = Router();

router.post(
  '/',
  validateRequest({ body: ContactInquirySchema }),
  ContactController.submitInquiry
);

export const contactRoutes: Router = router;
