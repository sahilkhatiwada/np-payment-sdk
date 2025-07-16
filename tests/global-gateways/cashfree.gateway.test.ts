import { CashfreeGateway } from '../../src/global-gateways/cashfree';
import { PaymentParams, VerifyParams, RefundParams } from '../../src/types/gateway';
import { CFEnvironment } from 'cashfree-pg/dist/configuration';

const mockPGCreateOrder = jest.fn();
const mockPGFetchOrder = jest.fn();
const mockPGOrderRefund = jest.fn();

// Mock the Cashfree SDK methods to simulate success
jest.mock('cashfree-pg', () => {
  return {
    Cashfree: jest.fn().mockImplementation(() => ({
      PGCreateOrder: jest.fn().mockResolvedValue({ data: { order_id: 'order_123', order_status: 'PAID' } }),
      PGFetchOrder: jest.fn().mockResolvedValue({ data: { order_id: 'order_123', order_status: 'PAID' } }),
      PGOrderRefund: jest.fn().mockResolvedValue({ data: { refund_id: 'refund_123', refund_status: 'SUCCESS' } }),
    })),
  };
});

describe('CashfreeGateway', () => {
  const gateway = new CashfreeGateway({ clientId: 'id', clientSecret: 'secret', environment: CFEnvironment.SANDBOX });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate a payment', async () => {
    mockPGCreateOrder.mockResolvedValue({ orderId: 'order_123', orderStatus: 'CREATED' });
    const params: PaymentParams = {
      gateway: 'cashfree',
      amount: 10,
      currency: 'INR',
      returnUrl: 'https://test.com/callback',
      customerId: 'cus',
      email: 'test@example.com',
      phone: '1234567890',
    };
    const result = await gateway.pay(params);
    expect(result.status).toBe('success');
    expect(result.params.orderId).toBe('order_123');
  });

  it('should verify a payment', async () => {
    mockPGFetchOrder.mockResolvedValue({ orderId: 'order_123', orderStatus: 'PAID' });
    const params: VerifyParams = {
      gateway: 'cashfree',
      transactionId: 'order_123',
      amount: 10,
    };
    const result = await gateway.verify(params);
    expect(result.status).toBe('success');
    expect(result.params.orderId).toBe('order_123');
  });

  it('should refund a payment', async () => {
    mockPGOrderRefund.mockResolvedValue({ refundId: 'refund_123', refundStatus: 'SUCCESS' });
    const params: RefundParams = {
      gateway: 'cashfree',
      transactionId: 'order_123',
      amount: 10,
    };
    const result = await gateway.refund(params);
    expect(result.status).toBe('success');
    expect(result.params.refundId).toBe('refund_123');
  });

  it('should return cancelled for subscribe', async () => {
    const result = await gateway.subscribe({});
    expect(result.status).toBe('cancelled');
  });

  it('should return cancelled for createInvoice', async () => {
    const result = await gateway.createInvoice({});
    expect(result.status).toBe('cancelled');
  });

  it('should return failure for wallet', async () => {
    const result = await gateway.wallet({});
    expect(result.status).toBe('failure');
  });
}); 