import { PaymentError, PaymentParams, PaymentResult } from '../types';

export interface EsewaConfig {
  clientId: string;
  secret: string;
  baseUrl?: string; // Allow override for sandbox/live
}

export class EsewaGateway {
  private baseUrl: string;

  constructor(private config: EsewaConfig) {
    this.baseUrl = config.baseUrl || 'https://uat.esewa.com.np'; // Use sandbox by default
  }

  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      // Example: eSewa payment initiation (mocked structure)
      const payload = {
        amt: params.amount,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: params.amount,
        pid: params.transactionId || 'demo-tx',
        scd: this.config.clientId,
        su: params.returnUrl,
        fu: params.failUrl || params.returnUrl,
      };
      // In real integration, use axios.post to eSewa endpoint
      // const response = await axios.post(`${this.baseUrl}/epay/main`, payload);
      // For now, mock response
      return {
        gateway: 'esewa',
        status: 'success',
        params: payload,
        message: 'Payment initiated (mock)'
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new PaymentError(err.message || 'eSewa payment failed', 'ESEWA_PAYMENT_ERROR');
      }
      throw new PaymentError('eSewa payment failed', 'ESEWA_PAYMENT_ERROR');
    }
  }

  async verify(params: { transactionId: string; amount: number; }): Promise<PaymentResult> {
    try {
      // Example: eSewa verification (mocked structure)
      // const response = await axios.post(`${this.baseUrl}/epay/transrec`, { ... });
      return {
        gateway: 'esewa',
        status: 'success',
        params,
        message: 'Payment verified (mock)'
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new PaymentError(err.message || 'eSewa verification failed', 'ESEWA_VERIFY_ERROR');
      }
      throw new PaymentError('eSewa verification failed', 'ESEWA_VERIFY_ERROR');
    }
  }

  async refund(params: { transactionId: string; amount: number; }): Promise<PaymentResult> {
    try {
      // Example: eSewa refund (mocked structure)
      // const response = await axios.post(`${this.baseUrl}/epay/refund`, { ... });
      return {
        gateway: 'esewa',
        status: 'success',
        params,
        message: 'Refund processed (mock)'
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new PaymentError(err.message || 'eSewa refund failed', 'ESEWA_REFUND_ERROR');
      }
      throw new PaymentError('eSewa refund failed', 'ESEWA_REFUND_ERROR');
    }
  }
} 