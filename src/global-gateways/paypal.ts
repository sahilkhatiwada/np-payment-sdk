import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionResult, InvoiceResult, WalletResult } from '../types/gateway';
import * as paypal from '@paypal/checkout-server-sdk';

/**
 * PayPal payment gateway implementation (real)
 */
export class PayPalGateway implements IPaymentGateway {
  private client;

  constructor(private config: { clientId: string; clientSecret: string; environment?: 'sandbox' | 'production' }) {
    const env = config.environment === 'production'
      ? new paypal.LiveEnvironment(config.clientId, config.clientSecret)
      : new paypal.SandboxEnvironment(config.clientId, config.clientSecret);
    this.client = new paypal.PayPalHttpClient(env);
  }

  /**
   * Initiate a payment (create order)
   */
  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: params.currency,
            value: params.amount.toString(),
          },
        }],
        application_context: {
          return_url: params.returnUrl,
          cancel_url: params.cancelUrl || params.returnUrl,
        },
      });
      const order = await this.client.execute(request);
      if (order.result.status && (order.result.status === 'CREATED' || order.result.status === 'APPROVED')) {
        return {
          gateway: 'paypal',
          status: 'success',
          params: order.result,
          message: 'PayPal order created',
        };
      } else {
        return {
          gateway: 'paypal',
          status: 'failure',
          params: order.result,
          message: 'PayPal order not created',
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'paypal',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'PayPal payment failed',
        };
      }
      return {
        gateway: 'paypal',
        status: 'failure',
        params: {},
        message: 'PayPal payment failed',
      };
    }
  }

  /**
   * Verify a payment (get order)
   */
  async verify(params: VerifyParams): Promise<PaymentResult> {
    try {
      const request = new paypal.orders.OrdersGetRequest(params.transactionId);
      const order = await this.client.execute(request);
      return {
        gateway: 'paypal',
        status: order.result.status === 'COMPLETED' ? 'success' : 'failure',
        params: order.result,
        message: 'PayPal order verification',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'paypal',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'PayPal verification failed',
        };
      }
      return {
        gateway: 'paypal',
        status: 'failure',
        params: {},
        message: 'PayPal verification failed',
      };
    }
  }

  /**
   * Refund a payment (capture refund)
   */
  async refund(params: RefundParams): Promise<PaymentResult> {
    try {
      // First, get the capture ID from the order
      const orderRequest = new paypal.orders.OrdersGetRequest(params.transactionId);
      const order = await this.client.execute(orderRequest);
      const captureId = order.result.purchase_units[0].payments.captures[0].id;
      const refundRequest = new paypal.payments.CapturesRefundRequest(captureId);
      refundRequest.requestBody({
        amount: {
          value: params.amount.toString(),
          currency_code: order.result.purchase_units[0].amount.currency_code,
        },
      });
      const refund = await this.client.execute(refundRequest);
      if (refund.result.status && refund.result.status === 'COMPLETED') {
        return {
          gateway: 'paypal',
          status: 'success',
          params: refund.result,
          message: 'PayPal refund processed',
        };
      } else {
        return {
          gateway: 'paypal',
          status: 'failure',
          params: refund.result,
          message: 'PayPal refund not completed',
        };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'paypal',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'PayPal refund failed',
        };
      }
      return {
        gateway: 'paypal',
        status: 'failure',
        params: {},
        message: 'PayPal refund failed',
      };
    }
  }

  /**
   * Create a subscription (not implemented)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async subscribe(_params?: Record<string, unknown>): Promise<SubscriptionResult> {
    return {
      gateway: 'paypal',
      status: 'cancelled',
      params: {},
      message: 'Paypal subscription not implemented',
    };
  }

  /**
   * Create an invoice (not implemented)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createInvoice(_params?: Record<string, unknown>): Promise<InvoiceResult> {
    return {
      gateway: 'paypal',
      status: 'cancelled',
      params: {},
      message: 'Paypal invoice not implemented',
    };
  }

  /**
   * Wallet operations (not supported)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async wallet(_params?: Record<string, unknown>): Promise<WalletResult> {
    return {
      gateway: 'paypal',
      status: 'failure',
      params: {},
      message: 'Paypal does not support wallet operations',
    };
  }
} 