import { StripeGateway } from '../../src/global-gateways/stripe';
import { PaymentParams, VerifyParams, RefundParams, SubscriptionParams, InvoiceParams, WalletParams } from '../../src/types/gateway';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ id: 'pi_123', status: 'requires_payment_method' }),
      retrieve: jest.fn().mockResolvedValue({ id: 'pi_123', status: 'succeeded' }),
    },
    refunds: {
      create: jest.fn().mockResolvedValue({ id: 're_123', status: 'succeeded' }),
    },
    subscriptions: {
      create: jest.fn().mockResolvedValue({ id: 'sub_123', status: 'active' }),
    },
    invoices: {
      create: jest.fn().mockResolvedValue({ id: 'in_123', status: 'draft' }),
    },
  }));
});

describe('StripeGateway', () => {
  const gateway = new StripeGateway({ apiKey: 'sk_test_123' });

  it('should initiate a payment', async () => {
    const params: PaymentParams = {
      gateway: 'stripe',
      amount: 10,
      currency: 'USD',
      returnUrl: 'https://test.com/callback',
    };
    const result = await gateway.pay(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('pi_123');
  });

  it('should verify a payment', async () => {
    const params: VerifyParams = {
      gateway: 'stripe',
      transactionId: 'pi_123',
      amount: 10,
    };
    const result = await gateway.verify(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('pi_123');
  });

  it('should refund a payment', async () => {
    const params: RefundParams = {
      gateway: 'stripe',
      transactionId: 'pi_123',
      amount: 10,
    };
    const result = await gateway.refund(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('re_123');
  });

  it('should create a subscription', async () => {
    const params: SubscriptionParams = {
      gateway: 'stripe',
      planId: 'plan_123',
      customerId: 'cus_123',
    };
    const result = await gateway.subscribe!(params);
    expect(result.status).toBe('active');
    expect(result.params.id).toBe('sub_123');
  });

  it('should create an invoice', async () => {
    const params: InvoiceParams = {
      gateway: 'stripe',
      amount: 10,
      currency: 'USD',
      customerId: 'cus_123',
    };
    const result = await gateway.createInvoice!(params);
    expect(result.status).toBe('created');
    expect(result.params.id).toBe('in_123');
  });

  it('should return failure for wallet operation', async () => {
    const params: WalletParams = {
      gateway: 'stripe',
      customerId: 'cus_123',
      amount: 10,
      currency: 'USD',
    };
    const result = await gateway.wallet!(params);
    expect(result.status).toBe('failure');
  });
}); 