import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionParams, SubscriptionResult, InvoiceParams, InvoiceResult, WalletParams, WalletResult } from '../types/gateway';
import Paystack from 'paystack-api';

/**
 * Paystack payment gateway implementation (real)
 */
export class PaystackGateway implements IPaymentGateway {
  private paystack: any;

  constructor(private config: { secretKey: string }) {
    this.paystack = Paystack(config.secretKey);
  }

  /**
   * Initiate a payment (initialize transaction)
   */
  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      const response = await this.paystack.transaction.initialize({
        amount: Math.round(params.amount * 100), // Paystack expects kobo
        email: params.email,
        currency: params.currency,
        callback_url: params.returnUrl,
        reference: params.transactionId || undefined,
      });
      return {
        gateway: 'paystack',
        status: response.status ? 'success' : 'failure',
        params: response.data,
        message: response.message || 'Paystack transaction initialized',
      };
    } catch (err: any) {
      return {
        gateway: 'paystack',
        status: 'failure',
        params: err,
        message: err.message || 'Paystack payment failed',
      };
    }
  }

  /**
   * Verify a payment
   */
  async verify(params: VerifyParams): Promise<PaymentResult> {
    try {
      const response = await this.paystack.transaction.verify(params.transactionId);
      return {
        gateway: 'paystack',
        status: response.data.status === 'success' ? 'success' : 'failure',
        params: response.data,
        message: 'Paystack payment verification',
      };
    } catch (err: any) {
      return {
        gateway: 'paystack',
        status: 'failure',
        params: err,
        message: err.message || 'Paystack verification failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refund(params: RefundParams): Promise<PaymentResult> {
    try {
      const response = await this.paystack.refund.create({
        transaction: params.transactionId,
        amount: Math.round(params.amount * 100),
      });
      return {
        gateway: 'paystack',
        status: response.status ? 'success' : 'failure',
        params: response.data,
        message: response.message || 'Paystack refund processed',
      };
    } catch (err: any) {
      return {
        gateway: 'paystack',
        status: 'failure',
        params: err,
        message: err.message || 'Paystack refund failed',
      };
    }
  }

  /**
   * Create a subscription (not implemented)
   */
  async subscribe(params: SubscriptionParams): Promise<SubscriptionResult> {
    return {
      gateway: 'paystack',
      status: 'cancelled',
      params: {},
      message: 'Paystack subscription not implemented',
    };
  }

  /**
   * Create an invoice (not implemented)
   */
  async createInvoice(params: InvoiceParams): Promise<InvoiceResult> {
    return {
      gateway: 'paystack',
      status: 'cancelled',
      params: {},
      message: 'Paystack invoice not implemented',
    };
  }

  /**
   * Wallet operations (not supported)
   */
  async wallet(params: WalletParams): Promise<WalletResult> {
    return {
      gateway: 'paystack',
      status: 'failure',
      params: {},
      message: 'Paystack does not support wallet operations',
    };
  }
} 