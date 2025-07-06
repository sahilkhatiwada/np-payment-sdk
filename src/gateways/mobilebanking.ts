import { PaymentParams, PaymentResult, PaymentError } from '../types';

export interface MobileBankingConfig {
  bankId: string;
  apiKey: string;
  baseUrl?: string;
}

export class MobileBankingGateway {
  private baseUrl: string;

  constructor(private config: MobileBankingConfig) {
    this.baseUrl = config.baseUrl || 'https://api.mobilebanking.com.np';
  }

  async pay(params: PaymentParams): Promise<PaymentResult> {
    // TODO: Implement Mobile Banking payment logic
    return { gateway: 'mobilebanking', status: 'success', params, message: 'Payment initiated (mock)' };
  }

  async verify(params: { transactionId: string; amount: number; }): Promise<PaymentResult> {
    // TODO: Implement Mobile Banking verification logic
    return { gateway: 'mobilebanking', status: 'success', params, message: 'Payment verified (mock)' };
  }

  async refund(params: { transactionId: string; amount: number; }): Promise<PaymentResult> {
    // TODO: Implement Mobile Banking refund logic
    return { gateway: 'mobilebanking', status: 'success', params, message: 'Refund processed (mock)' };
  }
} 