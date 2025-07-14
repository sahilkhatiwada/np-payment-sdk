import { PaymentSDK, GatewayType } from '../../../src';
import dotenv from 'dotenv';
dotenv.config();

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
  pay: (params: any) => sdk.pay(params),
  verify: (params: any) => sdk.verify(params),
  refund: (params: any) => sdk.refund(params),
  addTransaction: (record: any) => sdk.addTransaction(record),
  listTransactions: () => sdk.listTransactions(),
}; 