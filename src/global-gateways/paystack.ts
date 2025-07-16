import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionResult, InvoiceResult, WalletResult } from '../types/gateway';
import Paystack from 'paystack-api';

/**
 * Paystack payment gateway implementation (real)
 */
export class PaystackGateway implements IPaymentGateway {
  private paystack: ReturnType<typeof Paystack>;

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'paystack',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Paystack payment failed',
        };
      }
      return {
        gateway: 'paystack',
        status: 'failure',
        params: { error: String(err) },
        message: 'Paystack payment failed',
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'paystack',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Paystack verification failed',
        };
      }
      return {
        gateway: 'paystack',
        status: 'failure',
        params: { error: String(err) },
        message: 'Paystack verification failed',
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'paystack',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Paystack refund failed',
        };
      }
      return {
        gateway: 'paystack',
        status: 'failure',
        params: { error: String(err) },
        message: 'Paystack refund failed',
      };
    }
  }

  /**
   * Create a subscription (not implemented)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async subscribe(_params?: Record<string, unknown>): Promise<SubscriptionResult> {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createInvoice(_params?: Record<string, unknown>): Promise<InvoiceResult> {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async wallet(_params?: Record<string, unknown>): Promise<WalletResult> {
    return {
      gateway: 'paystack',
      status: 'failure',
      params: {},
      message: 'Paystack does not support wallet operations',
    };
  }
} 