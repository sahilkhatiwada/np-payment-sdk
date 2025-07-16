const mockExecute = jest.fn();
const mockOrdersCreateRequest = jest.fn();
mockOrdersCreateRequest.prototype.prefer = jest.fn();
mockOrdersCreateRequest.prototype.requestBody = jest.fn();
const mockOrdersGetRequest = jest.fn();
mockOrdersGetRequest.prototype.requestBody = jest.fn();
const mockCapturesRefundRequest = jest.fn();
mockCapturesRefundRequest.prototype.requestBody = jest.fn();
const mockPayments = { CapturesRefundRequest: mockCapturesRefundRequest };
const mockOrders = { OrdersCreateRequest: mockOrdersCreateRequest, OrdersGetRequest: mockOrdersGetRequest };

import { PayPalGateway } from '../../src/global-gateways/paypal';
import { PaymentParams, VerifyParams, RefundParams } from '../../src/types/gateway';

jest.mock('@paypal/checkout-server-sdk', () => {
  return {
    PayPalHttpClient: jest.fn().mockImplementation(() => ({ execute: mockExecute })),
    SandboxEnvironment: jest.fn().mockImplementation(() => ({})),
    LiveEnvironment: jest.fn().mockImplementation(() => ({})),
    orders: mockOrders,
    payments: mockPayments,
  };
});

describe('PayPalGateway', () => {
  const gateway = new PayPalGateway({ clientId: 'id', clientSecret: 'secret', environment: 'sandbox' });

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockReset();
  });

  it('should initiate a payment', async () => {
    mockOrdersCreateRequest.mockReturnValue('createReq');
    mockExecute.mockResolvedValueOnce({ result: { id: 'order_123', status: 'CREATED' } });
    const params: PaymentParams = {
      gateway: 'paypal',
      amount: 10,
      currency: 'USD',
      returnUrl: 'https://test.com/callback',
    };
    const result = await gateway.pay(params);
    if (result.status !== 'success') {
       
      console.error('Pay test result:', result);
    }
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('order_123');
  });

  it('should verify a payment', async () => {
    mockOrdersGetRequest.mockReturnValue('getReq');
    mockExecute.mockResolvedValueOnce({ result: { id: 'order_123', status: 'COMPLETED' } });
    const params: VerifyParams = {
      gateway: 'paypal',
      transactionId: 'order_123',
      amount: 10,
    };
    const result = await gateway.verify(params);
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('order_123');
  });

  it('should refund a payment', async () => {
    mockOrdersGetRequest.mockReturnValue('getReq');
    mockExecute
      .mockResolvedValueOnce({ result: { purchase_units: [{ payments: { captures: [{ id: 'cap_123' }], }, amount: { currency_code: 'USD' } }], } })
      .mockResolvedValueOnce({ result: { id: 'refund_123', status: 'COMPLETED' } });
    mockCapturesRefundRequest.mockReturnValue('refundReq');
    const params: RefundParams = {
      gateway: 'paypal',
      transactionId: 'order_123',
      amount: 10,
    };
    const result = await gateway.refund(params);
    if (result.status !== 'success') {
       
      console.error('Refund test result:', result);
    }
    expect(result.status).toBe('success');
    expect(result.params.id).toBe('refund_123');
  });

  it('should return failure for subscribe', async () => {
    const result = await gateway.subscribe({});
    expect(result.status).toBe('cancelled');
  });

  it('should return failure for createInvoice', async () => {
    const result = await gateway.createInvoice({});
    expect(result.status).toBe('cancelled');
  });

  it('should return failure for wallet', async () => {
    const result = await gateway.wallet({});
    expect(result.status).toBe('failure');
  });
}); 