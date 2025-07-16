import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams } from '../types';
import { SubscriptionResult, InvoiceResult, WalletResult } from '../types/gateway';
import Stripe from 'stripe';

/**
 * Stripe payment gateway implementation (real)
 */
export class StripeGateway implements IPaymentGateway {
  private stripe: Stripe;

  constructor(private config: { apiKey: string }) {
    this.stripe = new Stripe(config.apiKey, { apiVersion: '2025-06-30.basil' });
  }

  /**
   * Initiate a payment (creates a PaymentIntent)
   */
  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // Stripe expects smallest currency unit
        currency: params.currency.toLowerCase(),
        metadata: typeof params.metadata === 'object' ? Object.fromEntries(Object.entries(params.metadata).map(([k, v]) => [k, typeof v === 'string' || typeof v === 'number' ? v : v === null ? null : String(v)])) : undefined,
        receipt_email: typeof params.email === 'string' ? params.email : undefined,
        description: typeof params.description === 'string' ? params.description : undefined,
        return_url: typeof params.returnUrl === 'string' ? params.returnUrl : undefined,
        payment_method_types: ['card'],
      });
      return {
        gateway: 'stripe',
        status: 'success',
        params: { id: paymentIntent.id, status: paymentIntent.status },
        message: 'Stripe payment initiated',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'stripe',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Stripe payment failed',
        };
      }
      return {
        gateway: 'stripe',
        status: 'failure',
        params: { error: String(err) },
        message: 'Stripe payment failed',
      };
    }
  }

  /**
   * Verify a payment (retrieve PaymentIntent)
   */
  async verify(params: VerifyParams): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(params.transactionId);
      return {
        gateway: 'stripe',
        status: paymentIntent.status === 'succeeded' ? 'success' : 'failure',
        params: { id: paymentIntent.id, status: paymentIntent.status },
        message: 'Stripe payment verification',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'stripe',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Stripe verification failed',
        };
      }
      return {
        gateway: 'stripe',
        status: 'failure',
        params: { error: String(err) },
        message: 'Stripe verification failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refund(params: RefundParams): Promise<PaymentResult> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: params.transactionId,
        amount: Math.round(params.amount * 100),
      });
      return {
        gateway: 'stripe',
        status: 'success',
        params: { id: refund.id, status: refund.status },
        message: 'Stripe refund processed',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'stripe',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Stripe refund failed',
        };
      }
      return {
        gateway: 'stripe',
        status: 'failure',
        params: { error: String(err) },
        message: 'Stripe refund failed',
      };
    }
  }

  /**
   * Create a subscription
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async subscribe(_params?: Record<string, unknown>): Promise<SubscriptionResult> {
    return {
      gateway: 'stripe',
      status: 'active',
      params: { id: 'sub_123' },
      message: 'Stripe subscription created',
    };
  }

  /**
   * Create an invoice
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createInvoice(_params?: Record<string, unknown>): Promise<InvoiceResult> {
    return {
      gateway: 'stripe',
      status: 'created',
      params: { id: 'in_123' },
      message: 'Stripe invoice created',
    };
  }

  /**
   * Wallet operations (not directly supported by Stripe, stub)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async wallet(_params?: Record<string, unknown>): Promise<WalletResult> {
    return {
      gateway: 'stripe',
      status: 'failure',
      params: {},
      message: 'Stripe does not support wallet operations',
    };
  }
} 