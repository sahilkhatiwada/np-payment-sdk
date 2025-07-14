import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/paymentService';

/**
 * Initiate a payment
 */
export async function initiatePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const payment = await paymentService.pay(req.body);
    paymentService.addTransaction({ ...payment, transactionId: req.body.transactionId, createdAt: new Date(), updatedAt: new Date() });
    res.json(payment);
  } catch (err) {
    next(err);
  }
}

/**
 * Verify a payment
 */
export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentService.verify(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Refund a payment
 */
export async function refundPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentService.refund(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * List all transactions
 */
export function listTransactions(req: Request, res: Response) {
  const txs = paymentService.listTransactions();
  res.json(txs);
} 