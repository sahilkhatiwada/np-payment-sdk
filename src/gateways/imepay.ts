import { PaymentParams, PaymentResult, PaymentError } from '../types';

export interface IMEPayConfig {
  merchantCode: string;
  apiKey: string;
  baseUrl?: string;
}

export class IMEPayGateway {
  private baseUrl: string;

  constructor(private config: IMEPayConfig) {
    this.baseUrl = config.baseUrl || 'https://staging.imepay.com.np';
  }

  async pay(params: PaymentParams): Promise<PaymentResult> {
    // TODO: Implement IME Pay payment logic
    return { gateway: 'imepay', status: 'success', params, message: 'Payment initiated (mock)' };
  }

  async verify(params: { transactionId: string; amount: number; }): Promise<PaymentResult> {
    // TODO: Implement IME Pay verification logic
    return { gateway: 'imepay', status: 'success', params, message: 'Payment verified (mock)' };
  }

  async refund(params: { transactionId: string; amount: number; }): Promise<PaymentResult> {
    // TODO: Implement IME Pay refund logic
    return { gateway: 'imepay', status: 'success', params, message: 'Refund processed (mock)' };
  }
} 