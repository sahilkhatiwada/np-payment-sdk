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
    // @ts-ignore
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
      const refund = await (this.cashfree as any).PGOrderRefund(params.transactionId, params.amount);
      return {
        gateway: 'cashfree',
        status: 'success',
        params: { refundId: refund.data.refund_id, refundStatus: refund.data.refund_status },
        message: 'Cashfree refund successful',
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
  async subscribe(params: any): Promise<SubscriptionResult> {
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
  async createInvoice(params: any): Promise<InvoiceResult> {
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
  async wallet(params: any): Promise<WalletResult> {
    return {
      gateway: 'cashfree',
      status: 'failure',
      params: {},
      message: 'Cashfree does not support wallet operations',
    };
  }
} 