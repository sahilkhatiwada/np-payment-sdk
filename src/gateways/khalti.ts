import axios from 'axios';
import { PaymentParams, PaymentResult, PaymentError } from '../types';

export interface KhaltiConfig {
  publicKey: string;
  secretKey: string;
  baseUrl?: string;
}

export class KhaltiGateway {
  private baseUrl: string;

  constructor(private config: KhaltiConfig) {
    this.baseUrl = config.baseUrl || 'https://khalti.com/api/v2';
  }

  async pay(params: PaymentParams): Promise<PaymentResult> {
    try {
      const payload = {
        return_url: params.returnUrl,
        website_url: params.websiteUrl || params.returnUrl,
        amount: params.amount * 100, // Khalti expects amount in paisa
        purchase_order_id: params.transactionId,
        purchase_order_name: params.purchaseOrderName || 'Order',
        customer_info: params.customerInfo || {},
      };
      const response = await axios.post(
        `${this.baseUrl}/epayment/initiate/`,
        payload,
        {
          headers: {
            Authorization: `Key ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return {
        gateway: 'khalti',
        status: 'success',
        params: response.data,
        message: 'Payment initiated',
      };
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'detail' in err.response.data) {
        // @ts-expect-error: Type mismatch due to third-party library
        throw new PaymentError(err.response.data.detail || (err as Error).message || 'Khalti payment failed', 'KHALTI_PAYMENT_ERROR');
      }
      if (err instanceof Error) {
        throw new PaymentError(err.message || 'Khalti payment failed', 'KHALTI_PAYMENT_ERROR');
      }
      throw new PaymentError('Khalti payment failed', 'KHALTI_PAYMENT_ERROR');
    }
  }

  async verify(params: { transactionId: string; amount: number }): Promise<PaymentResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/epayment/lookup/`,
        {
          pidx: params.transactionId,
        },
        {
          headers: {
            Authorization: `Key ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return {
        gateway: 'khalti',
        status: response.data.status === 'Completed' ? 'success' : 'failure',
        params: response.data,
        message: 'Payment verification result',
      };
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'detail' in err.response.data) {
        // @ts-expect-error: Type mismatch due to third-party library
        throw new PaymentError(err.response.data.detail || (err as Error).message || 'Khalti verification failed', 'KHALTI_VERIFY_ERROR');
      }
      if (err instanceof Error) {
        throw new PaymentError(err.message || 'Khalti verification failed', 'KHALTI_VERIFY_ERROR');
      }
      throw new PaymentError('Khalti verification failed', 'KHALTI_VERIFY_ERROR');
    }
  }

  async refund(): Promise<PaymentResult> {
    // Khalti does not provide a public refund API as of now.
    throw new PaymentError('Khalti refund is not supported via public API', 'KHALTI_REFUND_UNSUPPORTED');
  }
} 