import { PaymentSDK, eventBus } from '../src';
import { IPaymentGateway, PaymentParams } from '../src/types/gateway';

const mockGateway: IPaymentGateway = {
  pay: jest.fn(async (params) => ({ gateway: params.gateway, status: 'success' as const, params: { id: 'pay_1' } })),
  verify: jest.fn(async (params) => ({ gateway: params.gateway, status: 'success' as const, params: { id: 'ver_1' } })),
  refund: jest.fn(async (params) => ({ gateway: params.gateway, status: 'success' as const, params: { id: 'ref_1' } })),
  subscribe: jest.fn(async (params) => ({ gateway: params.gateway, status: 'active' as const, params: { id: 'sub_1' } })),
  createInvoice: jest.fn(async (params) => ({ gateway: params.gateway, status: 'created' as const, params: { id: 'inv_1' } })),
  wallet: jest.fn(async (params) => ({ gateway: params.gateway, status: 'success' as const, params: { id: 'wal_1' } })),
};

describe('PaymentSDK Core', () => {
  const sdk = new PaymentSDK({
    mode: 'sandbox',
    gateways: {},
    customProviders: {
      stripe: mockGateway,
      paypal: mockGateway,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pay using a custom provider', async () => {
    const params: PaymentParams = {
      gateway: 'stripe',
      amount: 10,
      currency: 'USD',
      returnUrl: 'https://test.com/callback',
    };
    const result = await sdk.pay(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('pay_1');
  });

  it('should verify using a custom provider', async () => {
    const result = await sdk.verify({ gateway: 'paypal', transactionId: 'tx', amount: 10 });
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('ver_1');
  });

  it('should refund using a custom provider', async () => {
    const result = await sdk.refund({ gateway: 'stripe', transactionId: 'tx', amount: 10 });
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('ref_1');
  });

  it('should subscribe using a custom provider', async () => {
    const result = await sdk.subscribe({ gateway: 'stripe', planId: 'plan', customerId: 'cus' });
    expect(result.status).toBe('active');
    expect(result.params.id).toBe('sub_1');
  });

  it('should create an invoice using a custom provider', async () => {
    const result = await sdk.createInvoice({ gateway: 'paypal', amount: 10, currency: 'USD', customerId: 'cus' });
    expect(result.status).toBe('created');
    expect(result.params.id).toBe('inv_1');
  });

  it('should call wallet using a custom provider', async () => {
    const result = await sdk.wallet({ gateway: 'stripe', customerId: 'cus', amount: 10, currency: 'USD' });
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('wal_1');
  });

  it('should emit events for pay, verify, refund, subscribe, createInvoice, wallet', async () => {
    const events: string[] = [];
    eventBus.on('pay', () => events.push('pay'));
    eventBus.on('verify', () => events.push('verify'));
    eventBus.on('refund', () => events.push('refund'));
    eventBus.on('subscribe', () => events.push('subscribe'));
    eventBus.on('createInvoice', () => events.push('createInvoice'));
    eventBus.on('wallet', () => events.push('wallet'));
    await sdk.pay({ gateway: 'stripe', amount: 10, currency: 'USD', returnUrl: 'https://test.com' });
    await sdk.verify({ gateway: 'stripe', transactionId: 'tx', amount: 10 });
    await sdk.refund({ gateway: 'stripe', transactionId: 'tx', amount: 10 });
    await sdk.subscribe({ gateway: 'stripe', planId: 'plan', customerId: 'cus' });
    await sdk.createInvoice({ gateway: 'stripe', amount: 10, currency: 'USD', customerId: 'cus' });
    await sdk.wallet({ gateway: 'stripe', customerId: 'cus', amount: 10, currency: 'USD' });
    expect(events).toEqual(['pay', 'verify', 'refund', 'subscribe', 'createInvoice', 'wallet']);
  });

  it('should add, update, get, and list transactions', () => {
    const tx = {
      gateway: 'test',
      status: 'success' as const,
      params: {},
      transactionId: 'tx-advanced',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    sdk.addTransaction(tx);
    expect(sdk.getTransaction('tx-advanced')).toBeDefined();
    sdk.updateTransaction('tx-advanced', { status: 'failure' });
    expect(sdk.getTransaction('tx-advanced')?.status).toBe('failure');
    expect(sdk.listTransactions().length).toBeGreaterThan(0);
  });
}); 