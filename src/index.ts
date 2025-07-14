import { EsewaGateway, EsewaConfig } from './gateways/esewa';
import { KhaltiGateway, KhaltiConfig } from './gateways/khalti';
import { ConnectIPSGateway, ConnectIPSConfig } from './gateways/connectips';
import { IMEPayGateway, IMEPayConfig } from './gateways/imepay';
import { MobileBankingGateway, MobileBankingConfig } from './gateways/mobilebanking';
import { PaymentParams, PaymentResult, PaymentError } from './types';
import * as txStore from './utils/transactionStore';
import { TransactionRecord } from './utils/transactionStore';
import { IPaymentGateway } from './types/gateway';
import { eventBus } from './utils/eventBus';

export enum GatewayType {
  ESEWA = 'esewa',
  KHALTI = 'khalti',
  CONNECTIPS = 'connectips',
  IMEPAY = 'imepay',
  MOBILEBANKING = 'mobilebanking',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  RAZORPAY = 'razorpay',
  CASHFREE = 'cashfree',
  FLUTTERWAVE = 'flutterwave',
  PAYSTACK = 'paystack',
  // ...add more as needed
}

export interface PaymentSDKConfig {
  mode: 'sandbox' | 'production';
  gateways: {
    esewa?: EsewaConfig;
    khalti?: KhaltiConfig;
    connectips?: ConnectIPSConfig;
    imepay?: IMEPayConfig;
    mobilebanking?: MobileBankingConfig;
    stripe?: any;
    paypal?: any;
    razorpay?: any;
    cashfree?: any;
    flutterwave?: any;
    paystack?: any;
    [key: string]: any;
  };
  customProviders?: { [key: string]: IPaymentGateway };
}

export class PaymentSDK {
  private gateways: Map<string, IPaymentGateway> = new Map();

  constructor(private config: PaymentSDKConfig) {
    // Local gateways
    if (config.gateways.esewa) {
      this.gateways.set(GatewayType.ESEWA, new EsewaGateway(config.gateways.esewa));
    }
    if (config.gateways.khalti) {
      this.gateways.set(GatewayType.KHALTI, new KhaltiGateway(config.gateways.khalti));
    }
    if (config.gateways.connectips) {
      this.gateways.set(GatewayType.CONNECTIPS, new ConnectIPSGateway(config.gateways.connectips));
    }
    if (config.gateways.imepay) {
      this.gateways.set(GatewayType.IMEPAY, new IMEPayGateway(config.gateways.imepay));
    }
    if (config.gateways.mobilebanking) {
      this.gateways.set(GatewayType.MOBILEBANKING, new MobileBankingGateway(config.gateways.mobilebanking));
    }
    // Global gateways (to be implemented)
    if (config.gateways.stripe) {
      // Placeholder: will import and use StripeGateway
      // this.gateways.set(GatewayType.STRIPE, new StripeGateway(config.gateways.stripe));
    }
    if (config.gateways.paypal) {
      // Placeholder: will import and use PayPalGateway
    }
    // ...add more as needed
    // Custom providers
    if (config.customProviders) {
      for (const [key, provider] of Object.entries(config.customProviders)) {
        this.gateways.set(key, provider);
      }
    }
  }

  /**
   * Register a new payment provider at runtime
   */
  registerProvider(key: string, provider: IPaymentGateway) {
    this.gateways.set(key, provider);
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
    const gateway = this.gateways.get(params.gateway);
    if (!gateway) {
      throw new PaymentError('Gateway not configured: ' + params.gateway, 'GATEWAY_NOT_CONFIGURED');
    }
    const result = await gateway.pay(params);
    eventBus.emit('pay', { gateway: params.gateway, params, result });
    return result;
  }

  async verify(params: any): Promise<PaymentResult> {
    const gateway = this.gateways.get(params.gateway);
    if (!gateway) {
      throw new PaymentError('Gateway not configured: ' + params.gateway, 'GATEWAY_NOT_CONFIGURED');
    }
    const result = await gateway.verify(params);
    eventBus.emit('verify', { gateway: params.gateway, params, result });
    return result;
  }

  async refund(params: any): Promise<PaymentResult> {
    const gateway = this.gateways.get(params.gateway);
    if (!gateway) {
      throw new PaymentError('Gateway not configured: ' + params.gateway, 'GATEWAY_NOT_CONFIGURED');
    }
    const result = await gateway.refund(params);
    eventBus.emit('refund', { gateway: params.gateway, params, result });
    return result;
  }

  async subscribe(params: any): Promise<any> {
    const gateway = this.gateways.get(params.gateway);
    if (!gateway || !gateway.subscribe) {
      throw new PaymentError('Subscription not supported for gateway: ' + params.gateway, 'SUBSCRIPTION_NOT_SUPPORTED');
    }
    const result = await gateway.subscribe(params);
    eventBus.emit('subscribe', { gateway: params.gateway, params, result });
    return result;
  }

  async createInvoice(params: any): Promise<any> {
    const gateway = this.gateways.get(params.gateway);
    if (!gateway || !gateway.createInvoice) {
      throw new PaymentError('Invoice not supported for gateway: ' + params.gateway, 'INVOICE_NOT_SUPPORTED');
    }
    const result = await gateway.createInvoice(params);
    eventBus.emit('createInvoice', { gateway: params.gateway, params, result });
    return result;
  }

  async wallet(params: any): Promise<any> {
    const gateway = this.gateways.get(params.gateway);
    if (!gateway || !gateway.wallet) {
      throw new PaymentError('Wallet not supported for gateway: ' + params.gateway, 'WALLET_NOT_SUPPORTED');
    }
    const result = await gateway.wallet(params);
    eventBus.emit('wallet', { gateway: params.gateway, params, result });
    return result;
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

export { eventBus }; 