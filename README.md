# np-payment-sdk

Unified Payment SDK for Nepal

[![npm version](https://img.shields.io/npm/v/np-payment-sdk)](https://www.npmjs.com/package/np-payment-sdk)
[![npm](https://img.shields.io/npm/dt/np-payment-sdk)](https://www.npmjs.com/package/np-payment-sdk)
[![License](https://img.shields.io/github/license/sahilkhatiwada/np-payment-sdk)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/sahilkhatiwada/np-payment-sdk?style=social)](https://github.com/sahilkhatiwada/np-payment-sdk/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sahilkhatiwada/np-payment-sdk?style=social)](https://github.com/sahilkhatiwada/np-payment-sdk/network)
[![GitHub issues](https://img.shields.io/github/issues/sahilkhatiwada/np-payment-sdk)](https://github.com/sahilkhatiwada/np-payment-sdk/issues)
[![Last Commit](https://img.shields.io/github/last-commit/sahilkhatiwada/np-payment-sdk)](https://github.com/sahilkhatiwada/np-payment-sdk/commits/master)
[![Build Status](https://github.com/sahilkhatiwada/np-payment-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/sahilkhatiwada/np-payment-sdk/actions/workflows/ci.yml)


## Features
- Unified API for multiple Nepali payment gateways (eSewa, Khalti, ConnectIPS, IME Pay, Mobile Banking)
- Easy configuration for sandbox & production
- Payment, verification, and refund flows
- Webhook handler for payment status updates
- Transaction history utilities
- TypeScript support

## Supported Gateways
- eSewa
- Khalti
- ConnectIPS
- IME Pay
- Mobile Banking

## Installation
```bash
npm install np-payment-sdk
# or
yarn add np-payment-sdk
# or
pnpm add np-payment-sdk
```

## Basic Usage
```typescript
import { PaymentSDK, GatewayType } from 'np-payment-sdk';

const sdk = new PaymentSDK({
  mode: 'sandbox',
  gateways: {
    esewa: { clientId: 'your-esewa-client-id', secret: 'your-esewa-secret' },
    khalti: { publicKey: 'your-khalti-public-key', secretKey: 'your-khalti-secret-key' },
    // ...other gateways
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
```

## Advanced Usage (Express + Webhook)
```typescript
import express from 'express';
import { PaymentSDK, GatewayType } from 'np-payment-sdk';
import { paymentWebhookHandler } from 'np-payment-sdk/handlers/webhook';

const sdk = new PaymentSDK({
  mode: 'production',
  gateways: {
    khalti: {
      publicKey: process.env.KHALTI_PUBLIC_KEY || '',
      secretKey: process.env.KHALTI_SECRET_KEY || '',
      baseUrl: 'https://khalti.com/api/v2',
    },
  },
});

// Initiate payment
const payment = await sdk.pay({
  gateway: GatewayType.KHALTI,
  amount: 1000,
  currency: 'NPR',
  returnUrl: 'https://yourapp.com/payment/callback',
  transactionId: 'demo-tx-1',
  purchaseOrderName: 'Test Order',
  customerInfo: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '9800000000',
  },
});
sdk.addTransaction({ ...payment, transactionId: 'demo-tx-1', createdAt: new Date(), updatedAt: new Date() });

// Express webhook integration
const app = express();
app.use(express.json());
app.post('/webhook', paymentWebhookHandler);
app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

## Frontend Usage (React/Next.js)
**Never expose your secret keys in frontend code! Always use a backend API.**

### React Example
See [`examples/frontend-react-usage.md`](examples/frontend-react-usage.md) for a full guide.

### Next.js Example
See [`examples/nextjs-usage.md`](examples/nextjs-usage.md) for a full guide.

## API Reference
### PaymentSDK
- `constructor(config: PaymentSDKConfig)`
- `pay(params: PaymentParams): Promise<PaymentResult>`
- `verify(params: { gateway, transactionId, amount }): Promise<PaymentResult>`
- `refund(params: { gateway, transactionId, amount }): Promise<PaymentResult>`
- `addTransaction(record)`
- `updateTransaction(transactionId, updates)`
- `getTransaction(transactionId)`
- `listTransactions()`

### Types
- `PaymentParams`: `{ gateway, amount, currency, returnUrl, ... }`
- `PaymentResult`: `{ gateway, status, params, message? }`
- `PaymentError extends Error`
- `GatewayType`: Enum of supported gateways

### Gateway Configs
- **eSewa**: `{ clientId, secret, baseUrl? }`
- **Khalti**: `{ publicKey, secretKey, baseUrl? }`
- **ConnectIPS**: `{ clientId, secret, baseUrl? }`
- **IME Pay**: `{ merchantCode, apiKey, baseUrl? }`
- **Mobile Banking**: `{ bankId, apiKey, baseUrl? }`

## Webhook Integration
Use the provided `paymentWebhookHandler` for Express/Node.js to handle payment status updates from gateways. See the [advanced usage example](#advanced-usage-express--webhook) and [`examples/advanced-usage.ts`](examples/advanced-usage.ts).

## Examples
- [Basic Usage](examples/basic-usage.ts)
- [Advanced Usage](examples/advanced-usage.ts)
- [Frontend (React)](examples/frontend-react-usage.md)
- [Next.js](examples/nextjs-usage.md)

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## 📄 License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
