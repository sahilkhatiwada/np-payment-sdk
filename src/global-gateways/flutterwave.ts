import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionResult, InvoiceResult, WalletResult } from '../types/gateway';
import Flutterwave from 'flutterwave-node-v3';

/**
 * Flutterwave payment gateway implementation (real)
 */
export class FlutterwaveGateway implements IPaymentGateway {
  private flw: unknown;

  constructor(private config: { publicKey: string; secretKey: string; encryptionKey: string }) {
    this.flw = new Flutterwave(config.publicKey, config.secretKey);
  }

  /**
   * Initiate a payment (card charge)
   */
  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      const payload = {
        card_number: params.cardNumber,
        cvv: params.cvv,
        expiry_month: params.expiryMonth,
        expiry_year: params.expiryYear,
        currency: params.currency,
        amount: params.amount,
        fullname: params.fullname,
        email: params.email,
        tx_ref: params.transactionId || `flw_tx_${Date.now()}`,
        redirect_url: params.returnUrl,
      };
      const response = await (this.flw as unknown as { Charge: { card: (payload: Record<string, unknown>) => Promise<Record<string, unknown>> } }).Charge.card(payload);
      let message = (response as Record<string, unknown>).message;
      if (typeof message !== 'string') message = 'Flutterwave payment initiated';
      return {
        gateway: 'flutterwave',
        status: (response as Record<string, unknown>).status === 'success' ? 'success' : 'failure',
        params: response as Record<string, unknown>,
        message: message as string,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'flutterwave',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Flutterwave payment failed',
        };
      }
      return {
        gateway: 'flutterwave',
        status: 'failure',
        params: { error: String(err) },
        message: 'Flutterwave payment failed',
      };
    }
  }

  /**
   * Verify a payment
   */
  async verify(params: VerifyParams): Promise<PaymentResult> {
    try {
      const response = await (this.flw as unknown as { Transaction: { verify: (params: Record<string, unknown>) => Promise<{ data: Record<string, unknown> }> } }).Transaction.verify({ id: params.transactionId });
      return {
        gateway: 'flutterwave',
        status: (response as { data: Record<string, unknown> }).data.status === 'successful' ? 'success' : 'failure',
        params: (response as { data: Record<string, unknown> }).data,
        message: 'Flutterwave payment verification',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'flutterwave',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Flutterwave verification failed',
        };
      }
      return {
        gateway: 'flutterwave',
        status: 'failure',
        params: { error: String(err) },
        message: 'Flutterwave verification failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refund(params: RefundParams): Promise<PaymentResult> {
    try {
      const response = await (this.flw as unknown as { Refund: { refund: (params: Record<string, unknown>) => Promise<Record<string, unknown>> } }).Refund.refund({
        id: params.transactionId,
        amount: params.amount,
        secKey: this.config.secretKey,
      });
      let refundMessage = (response as Record<string, unknown>).message;
      if (typeof refundMessage !== 'string') refundMessage = 'Flutterwave refund processed';
      return {
        gateway: 'flutterwave',
        status: (response as Record<string, unknown>).status === 'success' ? 'success' : 'failure',
        params: response as Record<string, unknown>,
        message: refundMessage as string,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          gateway: 'flutterwave',
          status: 'failure',
          params: { error: err.message },
          message: err.message || 'Flutterwave refund failed',
        };
      }
      return {
        gateway: 'flutterwave',
        status: 'failure',
        params: { error: String(err) },
        message: 'Flutterwave refund failed',
      };
    }
  }

  /**
   * Create a subscription (not implemented)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async subscribe(_params?: Record<string, unknown>): Promise<SubscriptionResult> {
    return {
      gateway: 'flutterwave',
      status: 'cancelled',
      params: {},
      message: 'Flutterwave subscription not implemented',
    };
  }

  /**
   * Create an invoice (not implemented)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createInvoice(_params?: Record<string, unknown>): Promise<InvoiceResult> {
    return {
      gateway: 'flutterwave',
      status: 'cancelled',
      params: {},
      message: 'Flutterwave invoice not implemented',
    };
  }

  /**
   * Wallet operations (not supported)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async wallet(_params?: Record<string, unknown>): Promise<WalletResult> {
    return {
      gateway: 'flutterwave',
      status: 'failure',
      params: {},
      message: 'Flutterwave does not support wallet operations',
    };
  }
} 