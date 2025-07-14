import { IPaymentGateway, PaymentParams, PaymentResult, VerifyParams, RefundParams, SubscriptionParams, SubscriptionResult, InvoiceParams, InvoiceResult, WalletParams, WalletResult } from '../types/gateway';
import Flutterwave from 'flutterwave-node-v3';

/**
 * Flutterwave payment gateway implementation (real)
 */
export class FlutterwaveGateway implements IPaymentGateway {
  private flw: any;

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
      const response = await this.flw.Charge.card(payload);
      return {
        gateway: 'flutterwave',
        status: response.status === 'success' ? 'success' : 'failure',
        params: response,
        message: response.message || 'Flutterwave payment initiated',
      };
    } catch (err: any) {
      return {
        gateway: 'flutterwave',
        status: 'failure',
        params: err,
        message: err.message || 'Flutterwave payment failed',
      };
    }
  }

  /**
   * Verify a payment
   */
  async verify(params: VerifyParams): Promise<PaymentResult> {
    try {
      const response = await this.flw.Transaction.verify({ id: params.transactionId });
      return {
        gateway: 'flutterwave',
        status: response.data.status === 'successful' ? 'success' : 'failure',
        params: response.data,
        message: 'Flutterwave payment verification',
      };
    } catch (err: any) {
      return {
        gateway: 'flutterwave',
        status: 'failure',
        params: err,
        message: err.message || 'Flutterwave verification failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refund(params: RefundParams): Promise<PaymentResult> {
    try {
      const response = await this.flw.Refund.refund({
        id: params.transactionId,
        amount: params.amount,
        secKey: this.config.secretKey,
      });
      return {
        gateway: 'flutterwave',
        status: response.status === 'success' ? 'success' : 'failure',
        params: response,
        message: response.message || 'Flutterwave refund processed',
      };
    } catch (err: any) {
      return {
        gateway: 'flutterwave',
        status: 'failure',
        params: err,
        message: err.message || 'Flutterwave refund failed',
      };
    }
  }

  /**
   * Create a subscription (not implemented)
   */
  async subscribe(params: SubscriptionParams): Promise<SubscriptionResult> {
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
  async createInvoice(params: InvoiceParams): Promise<InvoiceResult> {
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
  async wallet(params: WalletParams): Promise<WalletResult> {
    return {
      gateway: 'flutterwave',
      status: 'failure',
      params: {},
      message: 'Flutterwave does not support wallet operations',
    };
  }
} 