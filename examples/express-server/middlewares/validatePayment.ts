import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to validate payment request body
 */
export function validatePayment(req: Request, res: Response, next: NextFunction) {
  const { gateway, amount, currency, returnUrl } = req.body;
  if (!gateway || !amount || !currency || !returnUrl) {
    return res.status(400).json({ error: 'Missing required fields: gateway, amount, currency, returnUrl' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  next();
} 