import { PaystackGateway } from '../../src/global-gateways/paystack';
import { PaymentParams, VerifyParams, RefundParams } from '../../src/types/gateway';

const mockTransaction = { initialize: jest.fn(), verify: jest.fn() };
const mockRefund = { create: jest.fn() };

jest.mock('paystack-api', () => {
  return jest.fn().mockImplementation(() => ({
    transaction: mockTransaction,
    refund: mockRefund,
  }));
});

describe('PaystackGateway', () => {
  const gateway = new PaystackGateway({ secretKey: 'sk_test_123' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate a payment', async () => {
    mockTransaction.initialize.mockResolvedValue({ status: true, message: 'ok', data: { reference: 'ref_123' } });
    const params: PaymentParams = {
      gateway: 'paystack',
      amount: 10,
      currency: 'NGN',
      returnUrl: 'https://test.com/callback',
      email: 'test@example.com',
    };
    const result = await gateway.pay(params);
    expect(result.status).toBe('success');
    expect(result.params.reference).toBe('ref_123');
  });

  it('should verify a payment', async () => {
    mockTransaction.verify.mockResolvedValue({ data: { id: 'tx_123', status: 'success' } });
    const params: VerifyParams = {
      gateway: 'paystack',
      transactionId: 'tx_123',
      amount: 10,
    };
    const result = await gateway.verify(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('tx_123');
  });

  it('should refund a payment', async () => {
    mockRefund.create.mockResolvedValue({ status: true, message: 'ok', data: { id: 'refund_123' } });
    const params: RefundParams = {
      gateway: 'paystack',
      transactionId: 'tx_123',
      amount: 10,
    };
    const result = await gateway.refund(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('refund_123');
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