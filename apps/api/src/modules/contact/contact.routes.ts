import { Router } from 'express';
import { ContactController } from './contact.controller.js';
import { validateRequest } from '../../common/middleware/validate-request.js';
import { asyncHandler } from '../../common/utils/async-handler.js';
import { ContactInquirySchema } from '@portfolio/contracts';

const router = Router();

router.post(
  '/',
  validateRequest({ body: ContactInquirySchema }),
  asyncHandler(ContactController.submitInquiry)
);

export const contactRoutes: Router = router;
