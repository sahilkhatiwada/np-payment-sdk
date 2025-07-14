import { Router } from 'express';
import { initiatePayment, verifyPayment, refundPayment, listTransactions } from '../controllers/paymentController';
import { validatePayment } from '../middlewares/validatePayment';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

/**
 * @route POST /api/pay
 * @desc Initiate a payment
 */
router.post('/pay', authenticateJWT, validatePayment, initiatePayment);

/**
 * @route POST /api/verify
 * @desc Verify a payment
 */
router.post('/verify', authenticateJWT, verifyPayment);

/**
 * @route POST /api/refund
 * @desc Refund a payment
 */
router.post('/refund', authenticateJWT, refundPayment);

/**
 * @route GET /api/transactions
 * @desc List all transactions
 */
router.get('/transactions', authenticateJWT, listTransactions);

export default router; 