import { Router } from 'express';
import { paymentWebhookHandler } from '../../../src/handlers/webhook';

const router = Router();

/**
 * @route POST /api/webhook
 * @desc Handle payment gateway webhooks
 */
router.post('/webhook', paymentWebhookHandler);

export default router; 