import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionResult, InvoiceResult, WalletResult } from '../types/gateway';
import { Cashfree } from 'cashfree-pg';
import { CFEnvironment } from 'cashfree-pg/dist/configuration';

/**
 * Cashfree payment gateway implementation (real)
 */
export class CashfreeGateway implements IPaymentGateway {
  private cashfree: Cashfree;

  constructor(private config: { clientId: string; clientSecret: string; environment?: CFEnvironment }) {
    const env: CFEnvironment = config.environment ?? CFEnvironment.SANDBOX;
    // @ts-expect-error: SDK expects enum, type mismatch with type definition
    this.cashfree = new Cashfree(config.clientId, config.clientSecret, env);
  }

  /**
   * Initiate a payment (create order)
   */
  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      const order = await this.cashfree.PGCreateOrder({
        order_amount: Number(params.amount),
        order_currency: params.currency,
        customer_details: {
          customer_id: String(params.customerId),
          customer_email: String(params.email),
          customer_phone: String(params.phone),
        },
      });
      return {
        gateway: 'cashfree',
        status: 'success',
        params: { orderId: order.data.order_id, orderStatus: order.data.order_status },
        message: 'Cashfree order created',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'cashfree',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Cashfree payment failed',
        };
      }
      return {
        gateway: 'cashfree',
        status: 'failure',
        params: { error: String(err) },
        message: 'Cashfree payment failed',
      };
    }
  }

  /**
   * Verify a payment (fetch order)
   */
  async verify(params: VerifyParams): Promise<PaymentResult> {
    try {
      const order = await this.cashfree.PGFetchOrder(params.transactionId);
      return {
        gateway: 'cashfree',
        status: 'success',
        params: { orderId: order.data.order_id, orderStatus: order.data.order_status },
        message: 'Cashfree order verification',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'cashfree',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Cashfree verification failed',
        };
      }
      return {
        gateway: 'cashfree',
        status: 'failure',
        params: { error: String(err) },
        message: 'Cashfree verification failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refund(params: RefundParams): Promise<PaymentResult> {
    try {
      const refund = await (this.cashfree as unknown as { PGOrderRefund: (transactionId: string, amount: number) => Promise<{ data: { refund_id: string; refund_status: string } }> }).PGOrderRefund(params.transactionId, params.amount);
      return {
        gateway: 'cashfree',
        status: 'success',
        params: { refundId: refund.data.refund_id, refundStatus: refund.data.refund_status },
        message: 'Cashfree refund processed',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'cashfree',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Cashfree refund failed',
        };
      }
      return {
        gateway: 'cashfree',
        status: 'failure',
        params: { error: String(err) },
        message: 'Cashfree refund failed',
      };
    }
  }

  /**
   * Create a subscription (not implemented)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async subscribe(_params?: Record<string, unknown>): Promise<SubscriptionResult> {
    return {
      gateway: 'cashfree',
      status: 'cancelled',
      params: {},
      message: 'Cashfree subscription not implemented',
    };
  }

  /**
   * Create an invoice (not implemented)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createInvoice(_params?: Record<string, unknown>): Promise<InvoiceResult> {
    return {
      gateway: 'cashfree',
      status: 'cancelled',
      params: {},
      message: 'Cashfree invoice not implemented',
    };
  }

  /**
   * Wallet operations (not supported)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async wallet(_params?: Record<string, unknown>): Promise<WalletResult> {
    return {
      gateway: 'cashfree',
      status: 'failure',
      params: {},
      message: 'Cashfree does not support wallet operations',
    };
  }
} 