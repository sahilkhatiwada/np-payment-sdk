import { RazorpayGateway } from '../../src/global-gateways/razorpay';
import { PaymentParams, VerifyParams, RefundParams, SubscriptionParams, InvoiceParams, WalletParams } from '../../src/types/gateway';

const mockOrders = { create: jest.fn() };
const mockPayments = { fetch: jest.fn(), refund: jest.fn() };
const mockSubscriptions = { create: jest.fn() };
const mockInvoices = { create: jest.fn() };

jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => ({
    orders: mockOrders,
    payments: mockPayments,
    subscriptions: mockSubscriptions,
    invoices: mockInvoices,
  }));
});

describe('RazorpayGateway', () => {
  const gateway = new RazorpayGateway({ keyId: 'id', keySecret: 'secret' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate a payment', async () => {
    mockOrders.create.mockResolvedValue({ id: 'order_123', status: 'created' });
    const params: PaymentParams = {
      gateway: 'razorpay',
      amount: 10,
      currency: 'INR',
      returnUrl: 'https://test.com/callback',
    };
    const result = await gateway.pay(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('order_123');
  });

  it('should verify a payment', async () => {
    mockPayments.fetch.mockResolvedValue({ id: 'pay_123', status: 'captured' });
    const params: VerifyParams = {
      gateway: 'razorpay',
      transactionId: 'pay_123',
      amount: 10,
    };
    const result = await gateway.verify(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('pay_123');
  });

  it('should refund a payment', async () => {
    mockPayments.refund.mockResolvedValue({ id: 'refund_123', status: 'processed' });
    const params: RefundParams = {
      gateway: 'razorpay',
      transactionId: 'pay_123',
      amount: 10,
    };
    const result = await gateway.refund(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('refund_123');
  });

  it('should create a subscription', async () => {
    mockSubscriptions.create.mockResolvedValue({ id: 'sub_123', status: 'active' });
    const params: SubscriptionParams = { gateway: 'razorpay', planId: 'plan', customerId: 'cus' };
    const result = await gateway.subscribe!(params);
    expect(result.status).toBe('active');
    expect(result.params.id).toBe('sub_123');
  });

  it('should create an invoice', async () => {
    mockInvoices.create.mockResolvedValue({ id: 'inv_123', status: 'created' });
    const params: InvoiceParams = { gateway: 'razorpay', amount: 10, currency: 'INR', customerId: 'cus' };
    const result = await gateway.createInvoice!(params);
    expect(result.status).toBe('created');
    expect(result.params.id).toBe('inv_123');
  });

  it('should return failure for wallet', async () => {
    const params: WalletParams = { gateway: 'razorpay', customerId: 'cus', amount: 10, currency: 'INR' };
    const result = await gateway.wallet({});
    expect(result.status).toBe('failure');
  });
}); 