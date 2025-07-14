import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionParams, SubscriptionResult, InvoiceParams, InvoiceResult, WalletParams, WalletResult } from '../types/gateway';
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
        amount: Math.round(params.amount * 100), // Razorpay expects paise
        currency: params.currency,
        receipt: params.transactionId || undefined,
        payment_capture: true,
        notes: params.notes || {},
      });
      return {
        gateway: 'razorpay',
        status: 'success',
        params: order,
        message: 'Razorpay order created',
      };
    } catch (err: any) {
      return {
        gateway: 'razorpay',
        status: 'failure',
        params: err,
        message: err.message || 'Razorpay payment failed',
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
        params: payment,
        message: 'Razorpay payment verification',
      };
    } catch (err: any) {
      return {
        gateway: 'razorpay',
        status: 'failure',
        params: err,
        message: err.message || 'Razorpay verification failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refund(params: RefundParams): Promise<PaymentResult> {
    try {
      const refund = await this.razorpay.payments.refund(params.transactionId, {
        amount: Math.round(params.amount * 100),
      });
      return {
        gateway: 'razorpay',
        status: 'success',
        params: refund,
        message: 'Razorpay refund processed',
      };
    } catch (err: any) {
      return {
        gateway: 'razorpay',
        status: 'failure',
        params: err,
        message: err.message || 'Razorpay refund failed',
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
        total_count: params.totalCount || 12,
        notes: params.notes || {},
      });
      return {
        gateway: 'razorpay',
        status: subscription.status === 'active' ? 'active' : 'inactive',
        params: subscription,
        message: 'Razorpay subscription created',
      };
    } catch (err: any) {
      return {
        gateway: 'razorpay',
        status: 'cancelled',
        params: {},
        message: err.message || 'Razorpay subscription not implemented',
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
        customer: { name: params.customerName, email: params.customerEmail },
        amount: Math.round(params.amount * 100),
        currency: params.currency,
        description: params.description,
        notes: params.notes || {},
        line_items: [{ name: params.description || 'Item', amount: Math.round(params.amount * 100), currency: params.currency, quantity: 1 }],
      });
      return {
        gateway: 'razorpay',
        status: 'created',
        params: invoice,
        message: 'Razorpay invoice created',
      };
    } catch (err: any) {
      return {
        gateway: 'razorpay',
        status: 'cancelled',
        params: {},
        message: err.message || 'Razorpay invoice not implemented',
      };
    }
  }

  /**
   * Wallet operations (not supported)
   */
  async wallet(params: WalletParams): Promise<WalletResult> {
    return {
      gateway: 'razorpay',
      status: 'failure',
      params: {},
      message: 'Razorpay does not support wallet operations',
    };
  }
} 