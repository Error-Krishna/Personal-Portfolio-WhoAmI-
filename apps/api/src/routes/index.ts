import { Router } from 'express';
import { healthRoutes } from '../modules/health/health.routes.js';
import { contactRoutes } from '../modules/contact/contact.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/contact', contactRoutes);

export const apiRoutes: Router = router;
