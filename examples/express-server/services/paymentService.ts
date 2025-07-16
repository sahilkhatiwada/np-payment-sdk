import { PaymentSDK } from '../../../src';
import dotenv from 'dotenv';
dotenv.config();
import { PaymentParams, VerifyParams, RefundParams } from '../../../src/types/gateway';

const sdk = new PaymentSDK({
  mode: process.env.PAYMENT_MODE as 'sandbox' | 'production' || 'sandbox',
  gateways: {
    esewa: process.env.ESEWA_CLIENT_ID && process.env.ESEWA_SECRET ? {
      clientId: process.env.ESEWA_CLIENT_ID,
      secret: process.env.ESEWA_SECRET,
    } : undefined,
    khalti: process.env.KHALTI_PUBLIC_KEY && process.env.KHALTI_SECRET_KEY ? {
      publicKey: process.env.KHALTI_PUBLIC_KEY,
      secretKey: process.env.KHALTI_SECRET_KEY,
      baseUrl: 'https://khalti.com/api/v2',
    } : undefined,
    // Add other gateways as needed
  },
});

/**
 * Payment service encapsulating SDK operations
 */
export const paymentService = {
  pay: (params: PaymentParams) => sdk.pay(params),
  verify: (params: VerifyParams) => sdk.verify(params),
  refund: (params: RefundParams) => sdk.refund(params),
  addTransaction: (record: Record<string, unknown>) => sdk.addTransaction(record),
  listTransactions: () => sdk.listTransactions(),
}; 