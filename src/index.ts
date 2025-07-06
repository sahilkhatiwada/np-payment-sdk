import { EsewaGateway, EsewaConfig } from './gateways/esewa';
import { KhaltiGateway, KhaltiConfig } from './gateways/khalti';
import { ConnectIPSGateway, ConnectIPSConfig } from './gateways/connectips';
import { IMEPayGateway, IMEPayConfig } from './gateways/imepay';
import { MobileBankingGateway, MobileBankingConfig } from './gateways/mobilebanking';
import { PaymentParams, PaymentResult, PaymentError } from './types';
import * as txStore from './utils/transactionStore';
import { TransactionRecord } from './utils/transactionStore';

export enum GatewayType {
  ESEWA = 'esewa',
  KHALTI = 'khalti',
  CONNECTIPS = 'connectips',
  IMEPAY = 'imepay',
  MOBILEBANKING = 'mobilebanking',
}

export interface PaymentSDKConfig {
  mode: 'sandbox' | 'production';
  gateways: {
    esewa?: EsewaConfig;
    khalti?: KhaltiConfig;
    connectips?: ConnectIPSConfig;
    imepay?: IMEPayConfig;
    mobilebanking?: MobileBankingConfig;
    [key: string]: any;
  };
}

export class PaymentSDK {
  private esewa?: EsewaGateway;
  private khalti?: KhaltiGateway;
  private connectips?: ConnectIPSGateway;
  private imepay?: IMEPayGateway;
  private mobilebanking?: MobileBankingGateway;

  constructor(private config: PaymentSDKConfig) {
    if (config.gateways.esewa) {
      this.esewa = new EsewaGateway(config.gateways.esewa);
    }
    if (config.gateways.khalti) {
      this.khalti = new KhaltiGateway(config.gateways.khalti);
    }
    if (config.gateways.connectips) {
      this.connectips = new ConnectIPSGateway(config.gateways.connectips);
    }
    if (config.gateways.imepay) {
      this.imepay = new IMEPayGateway(config.gateways.imepay);
    }
    if (config.gateways.mobilebanking) {
      this.mobilebanking = new MobileBankingGateway(config.gateways.mobilebanking);
    }
  }

  async pay(params: PaymentParams): Promise<PaymentResult> {
    if (!params || typeof params !== 'object') {
      throw new PaymentError('Invalid payment parameters', 'INVALID_PARAMS');
    }
    if (!params.gateway) {
      throw new PaymentError('Missing gateway in payment parameters', 'MISSING_GATEWAY');
    }
    if (!params.amount || typeof params.amount !== 'number' || params.amount <= 0) {
      throw new PaymentError('Invalid or missing amount', 'INVALID_AMOUNT');
    }
    if (!params.currency) {
      throw new PaymentError('Missing currency', 'MISSING_CURRENCY');
    }
    if (!params.returnUrl) {
      throw new PaymentError('Missing returnUrl', 'MISSING_RETURN_URL');
    }
    try {
      switch (params.gateway) {
        case GatewayType.ESEWA:
          if (!this.esewa) throw new PaymentError('eSewa not configured', 'ESEWA_NOT_CONFIGURED');
          return await this.esewa.pay(params);
        case GatewayType.KHALTI:
          if (!this.khalti) throw new PaymentError('Khalti not configured', 'KHALTI_NOT_CONFIGURED');
          return await this.khalti.pay(params);
        case GatewayType.CONNECTIPS:
          if (!this.connectips) throw new PaymentError('ConnectIPS not configured', 'CONNECTIPS_NOT_CONFIGURED');
          return await this.connectips.pay(params);
        case GatewayType.IMEPAY:
          if (!this.imepay) throw new PaymentError('IME Pay not configured', 'IMEPAY_NOT_CONFIGURED');
          return await this.imepay.pay(params);
        case GatewayType.MOBILEBANKING:
          if (!this.mobilebanking) throw new PaymentError('Mobile Banking not configured', 'MOBILEBANKING_NOT_CONFIGURED');
          return await this.mobilebanking.pay(params);
        default:
          throw new PaymentError('Unsupported gateway', 'UNSUPPORTED_GATEWAY');
      }
    } catch (err: any) {
      if (err instanceof PaymentError) throw err;
      throw new PaymentError(err.message || 'Unknown error', 'INTERNAL_ERROR');
    }
  }

  async verify(params: { gateway: GatewayType; transactionId: string; amount: number; }): Promise<PaymentResult> {
    try {
      switch (params.gateway) {
        case GatewayType.ESEWA:
          if (!this.esewa) throw new PaymentError('eSewa not configured', 'ESEWA_NOT_CONFIGURED');
          return await this.esewa.verify(params);
        case GatewayType.KHALTI:
          if (!this.khalti) throw new PaymentError('Khalti not configured', 'KHALTI_NOT_CONFIGURED');
          return await this.khalti.verify(params);
        case GatewayType.CONNECTIPS:
          if (!this.connectips) throw new PaymentError('ConnectIPS not configured', 'CONNECTIPS_NOT_CONFIGURED');
          return await this.connectips.verify(params);
        case GatewayType.IMEPAY:
          if (!this.imepay) throw new PaymentError('IME Pay not configured', 'IMEPAY_NOT_CONFIGURED');
          return await this.imepay.verify(params);
        case GatewayType.MOBILEBANKING:
          if (!this.mobilebanking) throw new PaymentError('Mobile Banking not configured', 'MOBILEBANKING_NOT_CONFIGURED');
          return await this.mobilebanking.verify(params);
        default:
          throw new PaymentError('Unsupported gateway', 'UNSUPPORTED_GATEWAY');
      }
    } catch (err: any) {
      if (err instanceof PaymentError) throw err;
      throw new PaymentError(err.message || 'Unknown error', 'INTERNAL_ERROR');
    }
  }

  async refund(params: { gateway: GatewayType; transactionId: string; amount: number; }): Promise<PaymentResult> {
    try {
      switch (params.gateway) {
        case GatewayType.ESEWA:
          if (!this.esewa) throw new PaymentError('eSewa not configured', 'ESEWA_NOT_CONFIGURED');
          return await this.esewa.refund(params);
        case GatewayType.KHALTI:
          if (!this.khalti) throw new PaymentError('Khalti not configured', 'KHALTI_NOT_CONFIGURED');
          return await this.khalti.refund(params);
        case GatewayType.CONNECTIPS:
          if (!this.connectips) throw new PaymentError('ConnectIPS not configured', 'CONNECTIPS_NOT_CONFIGURED');
          return await this.connectips.refund(params);
        case GatewayType.IMEPAY:
          if (!this.imepay) throw new PaymentError('IME Pay not configured', 'IMEPAY_NOT_CONFIGURED');
          return await this.imepay.refund(params);
        case GatewayType.MOBILEBANKING:
          if (!this.mobilebanking) throw new PaymentError('Mobile Banking not configured', 'MOBILEBANKING_NOT_CONFIGURED');
          return await this.mobilebanking.refund(params);
        default:
          throw new PaymentError('Unsupported gateway', 'UNSUPPORTED_GATEWAY');
      }
    } catch (err: any) {
      if (err instanceof PaymentError) throw err;
      throw new PaymentError(err.message || 'Unknown error', 'INTERNAL_ERROR');
    }
  }

  // Transaction history and reconciliation tools
  addTransaction(record: any) {
    txStore.addTransaction(record);
  }
  updateTransaction(transactionId: string, updates: any) {
    txStore.updateTransaction(transactionId, updates);
  }
  getTransaction(transactionId: string): TransactionRecord | undefined {
    return txStore.getTransaction(transactionId);
  }
  listTransactions(): TransactionRecord[] {
    return txStore.listTransactions();
  }
} 