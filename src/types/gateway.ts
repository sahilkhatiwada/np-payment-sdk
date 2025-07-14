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

export interface VerifyParams {
  gateway: string;
  transactionId: string;
  amount: number;
  [key: string]: any;
}

export interface RefundParams {
  gateway: string;
  transactionId: string;
  amount: number;
  [key: string]: any;
}

export interface SubscriptionParams {
  gateway: string;
  planId: string;
  customerId: string;
  [key: string]: any;
}

export interface SubscriptionResult {
  gateway: string;
  status: 'active' | 'inactive' | 'cancelled';
  params: any;
  message?: string;
}

export interface InvoiceParams {
  gateway: string;
  amount: number;
  currency: string;
  customerId: string;
  [key: string]: any;
}

export interface InvoiceResult {
  gateway: string;
  status: 'created' | 'paid' | 'cancelled';
  params: any;
  message?: string;
}

export interface WalletParams {
  gateway: string;
  customerId: string;
  amount: number;
  currency: string;
  [key: string]: any;
}

export interface WalletResult {
  gateway: string;
  status: 'success' | 'failure';
  params: any;
  message?: string;
}

/**
 * Unified interface for all payment gateways
 */
export interface IPaymentGateway {
  /**
   * Initiate a payment
   */
  pay(params: PaymentParams): Promise<PaymentResult>;
  /**
   * Verify a payment
   */
  verify(params: VerifyParams): Promise<PaymentResult>;
  /**
   * Refund a payment
   */
  refund(params: RefundParams): Promise<PaymentResult>;
  /**
   * Create a subscription (if supported)
   */
  subscribe?(params: SubscriptionParams): Promise<SubscriptionResult>;
  /**
   * Create an invoice (if supported)
   */
  createInvoice?(params: InvoiceParams): Promise<InvoiceResult>;
  /**
   * Wallet operations (if supported)
   */
  wallet?(params: WalletParams): Promise<WalletResult>;
} 