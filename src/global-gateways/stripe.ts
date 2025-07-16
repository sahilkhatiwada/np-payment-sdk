import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionParams, SubscriptionResult, InvoiceParams, InvoiceResult, WalletResult } from '../types/gateway';
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
  async subscribe(params: SubscriptionParams): Promise<SubscriptionResult> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: params.customerId,
        items: [{ plan: params.planId }],
      });
      return {
        gateway: 'stripe',
        status: subscription.status === 'active' ? 'active' : 'inactive',
        params: { id: subscription.id, status: subscription.status },
        message: 'Stripe subscription created',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'stripe',
          status: 'cancelled',
          params: { error: err.message },
          message: 'Stripe subscription not implemented',
        };
      }
      return {
        gateway: 'stripe',
        status: 'cancelled',
        params: { error: String(err) },
        message: 'Stripe subscription not implemented',
      };
    }
  }

  /**
   * Create an invoice
   */
  async createInvoice(params: InvoiceParams): Promise<InvoiceResult> {
    try {
      const invoice = await this.stripe.invoices.create({
        customer: params.customer,
        metadata: typeof params.metadata === 'object' ? Object.fromEntries(Object.entries(params.metadata).map(([k, v]) => [k, typeof v === 'string' || typeof v === 'number' ? v : v === null ? null : String(v)])) : undefined,
      } as any);
      return {
        gateway: 'stripe',
        status: 'created',
        params: { id: invoice.id, status: invoice.status },
        message: 'Stripe invoice created',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'stripe',
          status: 'cancelled',
          params: { error: err.message },
          message: 'Stripe invoice not implemented',
        };
      }
      return {
        gateway: 'stripe',
        status: 'cancelled',
        params: { error: String(err) },
        message: 'Stripe invoice not implemented',
      };
    }
  }

  /**
   * Wallet operations (not directly supported by Stripe, stub)
   */
  async wallet(params: any): Promise<WalletResult> {
    return {
      gateway: 'stripe',
      status: 'failure',
      params: { error: 'Stripe does not support wallet operations' },
      message: 'Stripe does not support wallet operations',
    };
  }
} 