import { PaymentSDK, GatewayType } from '../src';

const sdk = new PaymentSDK({
  mode: 'sandbox',
  gateways: {
    esewa: { clientId: 'your-esewa-client-id', secret: 'your-esewa-secret' },
    khalti: { publicKey: 'your-khalti-public-key', secretKey: 'your-khalti-secret-key' },
  }
});

async function makePayment() {
  const result = await sdk.pay({
    gateway: GatewayType.ESEWA,
    amount: 1000,
    currency: 'NPR',
    returnUrl: 'https://yourapp.com/payment/callback',
  });
  console.log(result);
}

makePayment(); 