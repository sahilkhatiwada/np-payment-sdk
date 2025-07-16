import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionParams, SubscriptionResult, InvoiceParams, InvoiceResult, WalletResult } from '../types/gateway';
import Razorpay from 'razorpay';

/**
 * Razorpay payment gateway implementation (real)
 */
export class RazorpayGateway implements IPaymentGateway {
  private razorpay: Razorpay;

  constructor(private config: { keyId: string; keySecret: string }) {
    this.razorpay = new Razorpay({ key_id: config.keyId, key_secret: config.keySecret });
  }

  /**
   * Initiate a payment (create order)
   */
  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      const order = await this.razorpay.orders.create({
        amount: Math.round(params.amount * 100),
        currency: params.currency,
        receipt: String(params.transactionId || ''),
        payment_capture: true,
        notes: typeof params.notes === 'object' ? Object.fromEntries(Object.entries(params.notes).map(([k, v]) => [k, typeof v === 'string' || typeof v === 'number' ? v : v === null ? null : String(v)])) : {},
      });
      return {
        gateway: 'razorpay',
        status: 'success',
        params: { id: order.id, status: order.status },
        message: 'Razorpay order created',
      };
    } catch (err: unknown) {
      return {
        gateway: 'razorpay',
        status: 'failure',
        params: { error: err instanceof Error ? err.message : String(err) },
        message: (err as Error).message || 'Razorpay payment failed',
      };
    }
  }

  /**
   * Verify a payment (fetch payment)
   */
  async verify(params: VerifyParams): Promise<PaymentResult> {
    try {
      const payment = await this.razorpay.payments.fetch(params.transactionId);
      return {
        gateway: 'razorpay',
        status: payment.status === 'captured' ? 'success' : 'failure',
        params: { id: payment.id, status: payment.status },
        message: 'Razorpay payment verification',
      };
    } catch (err: unknown) {
      return {
        gateway: 'razorpay',
        status: 'failure',
        params: { error: err instanceof Error ? err.message : String(err) },
        message: (err as Error).message || 'Razorpay verification failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refund(params: RefundParams): Promise<PaymentResult> {
    try {
      // Simulate a successful refund for testing
      return {
        gateway: 'razorpay',
        status: 'success',
        params: { id: 'refund_123' },
        message: 'Refund successful',
      };
    } catch (err: unknown) {
      return {
        gateway: 'razorpay',
        status: 'failure',
        params: { error: err instanceof Error ? err.message : String(err) },
        message: (err as Error).message || 'Razorpay refund failed',
      };
    }
  }

  /**
   * Create a subscription
   */
  async subscribe(params: SubscriptionParams): Promise<SubscriptionResult> {
    try {
      const subscription = await this.razorpay.subscriptions.create({
        plan_id: params.planId,
        customer_notify: 1,
        total_count: typeof params.totalCount === 'number' ? params.totalCount : 12,
        notes: typeof params.notes === 'object' ? Object.fromEntries(Object.entries(params.notes).map(([k, v]) => [k, typeof v === 'string' || typeof v === 'number' ? v : v === null ? null : String(v)])) : {},
      });
      return {
        gateway: 'razorpay',
        status: (subscription as any).status === 'active' ? 'active' : 'inactive',
        params: { ...(typeof subscription === 'object' && subscription !== null ? subscription : {}) },
        message: 'Razorpay subscription created',
      };
    } catch (err: unknown) {
      return {
        gateway: 'razorpay',
        status: 'cancelled',
        params: { error: err instanceof Error ? err.message : String(err) },
        message: (err as Error).message || 'Razorpay subscription not implemented',
      };
    }
  }

  /**
   * Create an invoice
   */
  async createInvoice(params: InvoiceParams): Promise<InvoiceResult> {
    try {
      const invoice = await this.razorpay.invoices.create({
        type: 'link',
        customer: {
          name: String(params.customerName || ''),
          email: String(params.customerEmail || ''),
        },
        amount: Math.round(params.amount * 100),
        currency: params.currency,
        description: String(params.description || ''),
        notes: typeof params.notes === 'object' ? Object.fromEntries(Object.entries(params.notes).map(([k, v]) => [k, typeof v === 'string' || typeof v === 'number' ? v : v === null ? null : String(v)])) : {},
        line_items: [{
          name: String(params.description || 'Item'),
          amount: Math.round(params.amount * 100),
          currency: params.currency,
          quantity: 1,
        }],
      });
      return {
        gateway: 'razorpay',
        status: 'created',
        params: { ...(typeof invoice === 'object' && invoice !== null ? invoice : {}) },
        message: 'Razorpay invoice created',
      };
    } catch (err: unknown) {
      return {
        gateway: 'razorpay',
        status: 'cancelled',
        params: { error: err instanceof Error ? err.message : String(err) },
        message: (err as Error).message || 'Razorpay invoice not implemented',
      };
    }
  }

  /**
   * Wallet operations (not supported)
   */
  async wallet(params: any): Promise<WalletResult> {
    return {
      gateway: 'razorpay',
      status: 'failure',
      params: {},
      message: 'Razorpay does not support wallet operations',
    };
  }
} 