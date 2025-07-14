import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionParams, SubscriptionResult, InvoiceParams, InvoiceResult, WalletParams, WalletResult } from '../types/gateway';
import Stripe from 'stripe';

/**
 * Stripe payment gateway implementation (real)
 */
export class StripeGateway implements IPaymentGateway {
  private stripe: Stripe;

  constructor(private config: { apiKey: string }) {
    this.stripe = new Stripe(config.apiKey, { apiVersion: '2022-11-15' as any });
  }

  /**
   * Initiate a payment (creates a PaymentIntent)
   */
  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // Stripe expects smallest currency unit
        currency: params.currency.toLowerCase(),
        metadata: params.metadata || {},
        receipt_email: params.email,
        description: params.description,
        return_url: params.returnUrl,
        payment_method_types: ['card'],
      });
      return {
        gateway: 'stripe',
        status: 'success',
        params: paymentIntent,
        message: 'Stripe payment initiated',
      };
    } catch (err: any) {
      return {
        gateway: 'stripe',
        status: 'failure',
        params: err,
        message: err.message || 'Stripe payment failed',
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
        params: paymentIntent,
        message: 'Stripe payment verification',
      };
    } catch (err: any) {
      return {
        gateway: 'stripe',
        status: 'failure',
        params: err,
        message: err.message || 'Stripe verification failed',
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
        params: refund,
        message: 'Stripe refund processed',
      };
    } catch (err: any) {
      return {
        gateway: 'stripe',
        status: 'failure',
        params: err,
        message: err.message || 'Stripe refund failed',
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
        status: subscription.status as any,
        params: subscription,
        message: 'Stripe subscription created',
      };
    } catch (err: any) {
      return {
        gateway: 'stripe',
        status: 'cancelled',
        params: {},
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
        customer: params.customerId,
        auto_advance: true,
        collection_method: 'send_invoice',
        days_until_due: 30,
        metadata: params.metadata || {},
      });
      return {
        gateway: 'stripe',
        status: 'created',
        params: invoice,
        message: 'Stripe invoice created',
      };
    } catch (err: any) {
      return {
        gateway: 'stripe',
        status: 'cancelled',
        params: {},
        message: 'Stripe invoice not implemented',
      };
    }
  }

  /**
   * Wallet operations (not directly supported by Stripe, stub)
   */
  async wallet(params: WalletParams): Promise<WalletResult> {
    return {
      gateway: 'stripe',
      status: 'failure',
      params: {},
      message: 'Stripe does not support wallet operations',
    };
  }
} 