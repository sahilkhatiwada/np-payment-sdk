import { PaymentSDK, GatewayType } from '../src';
import { PaymentError } from '../src/types';
import { paymentWebhookHandler } from '../src/handlers/webhook';
import express, { RequestHandler } from 'express';
import request from 'supertest';
import { PaymentParams } from '../src/types/gateway';

describe('PaymentSDK', () => {
  it('should instantiate with config', () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
    expect(sdk).toBeInstanceOf(PaymentSDK);
  });

  it('should return success on pay (mock)', async () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
    const result = await sdk.pay({
      gateway: GatewayType.ESEWA,
      amount: 1000,
      currency: 'NPR',
      returnUrl: 'https://test.com/callback',
    });
    expect(result.status).toBe('success');
  });

  it('should throw error for missing gateway', async () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
    await expect(sdk.pay({ amount: 1000, currency: 'NPR', returnUrl: 'url' } as unknown as PaymentParams)).rejects.toThrow(PaymentError);
  });

  it('should throw error for invalid amount', async () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
    await expect(sdk.pay({ gateway: GatewayType.ESEWA, amount: 0, currency: 'NPR', returnUrl: 'url' })).rejects.toThrow(PaymentError);
  });

  it('should throw error for unsupported gateway', async () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
    await expect(sdk.pay({ gateway: 'unknown' as unknown as GatewayType, amount: 1000, currency: 'NPR', returnUrl: 'url' })).rejects.toThrow(PaymentError);
  });

  it('should verify a payment (mock)', async () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
    const result = await sdk.verify({
      gateway: GatewayType.ESEWA,
      transactionId: 'tx-verify',
      amount: 1000
    });
    expect(result.status).toBe('success');
    expect(result.gateway).toBe('esewa');
  });

  it('should refund a payment (mock)', async () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
    const result = await sdk.refund({
      gateway: GatewayType.ESEWA,
      transactionId: 'tx-refund',
      amount: 1000
    });
    expect(result.status).toBe('success');
    expect(result.gateway).toBe('esewa');
  });

  it('should throw error for verify with unsupported gateway', async () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
    await expect(sdk.verify({ gateway: 'unknown' as unknown as GatewayType, transactionId: 'tx', amount: 1000 })).rejects.toThrow(PaymentError);
  });

  it('should throw error for refund with unsupported gateway', async () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
    await expect(sdk.refund({ gateway: 'unknown' as unknown as GatewayType, transactionId: 'tx', amount: 1000 })).rejects.toThrow(PaymentError);
  });
});

describe('PaymentSDK Advanced', () => {
  it('should add, get, update, and list transactions', async () => {
    const sdk = new PaymentSDK({
      mode: 'sandbox',
      gateways: { esewa: { clientId: 'id', secret: 'secret' } }
    });
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

  it('should handle webhook POST (mock)', async () => {
    const app = express();
    app.use(express.json());
    app.post('/webhook', paymentWebhookHandler as unknown as RequestHandler);
    const res = await request(app)
      .post('/webhook?gateway=esewa')
      .send({ some: 'event' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('received', true);
  });
}); 