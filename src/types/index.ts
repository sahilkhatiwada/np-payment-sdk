export interface PaymentParams {
  gateway: string;
  amount: number;
  currency: string;
  returnUrl: string;
  [key: string]: any;
}

export interface PaymentResult {
  gateway: string;
  status: 'success' | 'failure';
  params: any;
  message?: string;
}

export class PaymentError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'PaymentError';
  }
} 