import { FlutterwaveGateway } from '../../src/global-gateways/flutterwave';
import { PaymentParams, VerifyParams, RefundParams, SubscriptionParams, InvoiceParams, WalletParams } from '../../src/types/gateway';

const mockCharge = { card: jest.fn() };
const mockTransaction = { verify: jest.fn() };
const mockRefund = { refund: jest.fn() };

jest.mock('flutterwave-node-v3', () => {
  return jest.fn().mockImplementation(() => ({
    Charge: mockCharge,
    Transaction: mockTransaction,
    Refund: mockRefund,
  }));
});

describe('FlutterwaveGateway', () => {
  const gateway = new FlutterwaveGateway({ publicKey: 'pk', secretKey: 'sk', encryptionKey: 'ek' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate a payment', async () => {
    mockCharge.card.mockResolvedValue({ status: 'success', message: 'ok', data: { id: 'tx_123' } });
    const params: PaymentParams = {
      gateway: 'flutterwave',
      amount: 10,
      currency: 'NGN',
      returnUrl: 'https://test.com/callback',
      cardNumber: '1234',
      cvv: '123',
      expiryMonth: '01',
      expiryYear: '30',
      fullname: 'Test User',
      email: 'test@example.com',
    };
    const result = await gateway.pay(params);
    expect(result.status).toBe('success');
    expect(result.params.data.id).toBe('tx_123');
  });

  it('should verify a payment', async () => {
    mockTransaction.verify.mockResolvedValue({ data: { id: 'tx_123', status: 'successful' } });
    const params: VerifyParams = {
      gateway: 'flutterwave',
      transactionId: 'tx_123',
      amount: 10,
    };
    const result = await gateway.verify(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('tx_123');
  });

  it('should refund a payment', async () => {
    mockRefund.refund.mockResolvedValue({ status: 'success', message: 'ok', data: { id: 'refund_123' } });
    const params: RefundParams = {
      gateway: 'flutterwave',
      transactionId: 'tx_123',
      amount: 10,
    };
    const result = await gateway.refund(params);
    expect(result.status).toBe('success');
    expect(result.params.data.id).toBe('refund_123');
  });

  it('should return cancelled for subscribe', async () => {
    const params: SubscriptionParams = { gateway: 'flutterwave', planId: 'plan', customerId: 'cus' };
    const result = await gateway.subscribe(params);
    expect(result.status).toBe('cancelled');
  });

  it('should return cancelled for createInvoice', async () => {
    const params: InvoiceParams = { gateway: 'flutterwave', amount: 10, currency: 'NGN', customerId: 'cus' };
    const result = await gateway.createInvoice(params);
    expect(result.status).toBe('cancelled');
  });

  it('should return failure for wallet', async () => {
    const params: WalletParams = { gateway: 'flutterwave', customerId: 'cus', amount: 10, currency: 'NGN' };
    const result = await gateway.wallet(params);
    expect(result.status).toBe('failure');
  });
}); 