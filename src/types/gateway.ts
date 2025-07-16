export interface PaymentParams<Extra = Record<string, unknown>> {
  gateway: string;
  amount: number;
  currency: string;
  returnUrl: string;
  // Allow extra fields, but type them as unknown
  [key: string]: string | number | undefined | Extra;
}

export interface PaymentResult<Params = Record<string, unknown>> {
  gateway: string;
  status: 'success' | 'failure';
  params: Params;
  message?: string;
}

export interface VerifyParams<Extra = Record<string, unknown>> {
  gateway: string;
  transactionId: string;
  amount: number;
  [key: string]: string | number | undefined | Extra;
}

export interface RefundParams<Extra = Record<string, unknown>> {
  gateway: string;
  transactionId: string;
  amount: number;
  [key: string]: string | number | undefined | Extra;
}

export interface SubscriptionParams<Extra = Record<string, unknown>> {
  gateway: string;
  planId: string;
  customerId: string;
  [key: string]: string | number | undefined | Extra;
}

export interface SubscriptionResult<Params = Record<string, unknown>> {
  gateway: string;
  status: 'active' | 'inactive' | 'cancelled';
  params: Params;
  message?: string;
}

export interface InvoiceParams<Extra = Record<string, unknown>> {
  gateway: string;
  amount: number;
  currency: string;
  customerId: string;
  [key: string]: string | number | undefined | Extra;
}

export interface InvoiceResult<Params = Record<string, unknown>> {
  gateway: string;
  status: 'created' | 'paid' | 'cancelled';
  params: Params;
  message?: string;
}

export interface WalletParams<Extra = Record<string, unknown>> {
  gateway: string;
  customerId: string;
  amount: number;
  currency: string;
  [key: string]: string | number | undefined | Extra;
}

export interface WalletResult<Params = Record<string, unknown>> {
  gateway: string;
  status: 'success' | 'failure';
  params: Params;
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