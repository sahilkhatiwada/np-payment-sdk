import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionParams, SubscriptionResult, InvoiceParams, InvoiceResult, WalletParams, WalletResult } from '../types/gateway';
import { Cashfree } from 'cashfree-pg';

/**
 * Cashfree payment gateway implementation (real)
 */
export class CashfreeGateway implements IPaymentGateway {
  private cashfree: any;

  constructor(private config: { clientId: string; clientSecret: string; environment?: 'TEST' | 'PROD' }) {
    this.cashfree = new Cashfree({
      env: config.environment || 'TEST',
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    } as any);
  }

  /**
   * Initiate a payment (create order)
   */
  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      const order = await this.cashfree.PGCreateOrder({
        orderAmount: params.amount,
        orderCurrency: params.currency,
        customerDetails: {
          customerId: params.customerId,
          customerEmail: params.email,
          customerPhone: params.phone,
        },
        orderNote: params.description,
        returnUrl: params.returnUrl,
        notifyUrl: params.notifyUrl || params.returnUrl,
      });
      return {
        gateway: 'cashfree',
        status: 'success',
        params: order,
        message: 'Cashfree order created',
      };
    } catch (err: any) {
      return {
        gateway: 'cashfree',
        status: 'failure',
        params: err,
        message: err.message || 'Cashfree payment failed',
      };
    }
  }

  /**
   * Verify a payment (fetch order)
   */
  async verify(params: VerifyParams): Promise<PaymentResult> {
    try {
      const order = await this.cashfree.PGFetchOrder({ orderId: params.transactionId });
      return {
        gateway: 'cashfree',
        status: order.orderStatus === 'PAID' ? 'success' : 'failure',
        params: order,
        message: 'Cashfree order verification',
      };
    } catch (err: any) {
      return {
        gateway: 'cashfree',
        status: 'failure',
        params: err,
        message: err.message || 'Cashfree verification failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refund(params: RefundParams): Promise<PaymentResult> {
    try {
      const refund = await this.cashfree.PGOrderRefund({
        orderId: params.transactionId,
        refundAmount: params.amount,
        refundId: params.refundId || `refund_${Date.now()}`,
      });
      return {
        gateway: 'cashfree',
        status: 'success',
        params: refund,
        message: 'Cashfree refund processed',
      };
    } catch (err: any) {
      return {
        gateway: 'cashfree',
        status: 'failure',
        params: err,
        message: err.message || 'Cashfree refund failed',
      };
    }
  }

  /**
   * Create a subscription (not implemented)
   */
  async subscribe(params: SubscriptionParams): Promise<SubscriptionResult> {
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
  async createInvoice(params: InvoiceParams): Promise<InvoiceResult> {
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
  async wallet(params: WalletParams): Promise<WalletResult> {
    return {
      gateway: 'cashfree',
      status: 'failure',
      params: {},
      message: 'Cashfree does not support wallet operations',
    };
  }
} 