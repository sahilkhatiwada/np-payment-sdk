# np-payment-sdk

Unified Payment SDK for Nepal and Global Payments

[![npm version](https://img.shields.io/npm/v/np-payment-sdk)](https://www.npmjs.com/package/np-payment-sdk)
[![npm](https://img.shields.io/npm/dt/np-payment-sdk)](https://www.npmjs.com/package/np-payment-sdk)
[![License](https://img.shields.io/github/license/sahilkhatiwada/np-payment-sdk)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/sahilkhatiwada/np-payment-sdk?style=social)](https://github.com/sahilkhatiwada/np-payment-sdk/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sahilkhatiwada/np-payment-sdk?style=social)](https://github.com/sahilkhatiwada/np-payment-sdk/network)
[![GitHub issues](https://img.shields.io/github/issues/sahilkhatiwada/np-payment-sdk)](https://github.com/sahilkhatiwada/np-payment-sdk/issues)
[![Last Commit](https://img.shields.io/github/last-commit/sahilkhatiwada/np-payment-sdk)](https://github.com/sahilkhatiwada/np-payment-sdk/commits/master)
[![Build Status](https://github.com/sahilkhatiwada/np-payment-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/sahilkhatiwada/np-payment-sdk/actions/workflows/ci.yml)


## Features
- Unified API for Nepali and global payment gateways (eSewa, Khalti, ConnectIPS, IME Pay, Mobile Banking, Stripe, PayPal, Razorpay, and more)
- Easy configuration for sandbox & production
- Payment, verification, refund, subscription, invoice, and wallet flows
- Event system for payment events and webhooks
- Transaction history utilities
- TypeScript support

## Supported Gateways
- eSewa
- Khalti
- ConnectIPS
- IME Pay
- Mobile Banking
- Stripe (global)
- PayPal (global, coming soon)
- Razorpay, Cashfree, Flutterwave, Paystack (coming soon)

## Installation
```bash
npm install np-payment-sdk
```

## Usage Example (Unified API)
```typescript
import { PaymentSDK, GatewayType, eventBus } from 'np-payment-sdk';
import { StripeGateway } from 'np-payment-sdk/src/global-gateways/stripe';

const sdk = new PaymentSDK({
  mode: 'production',
  gateways: {
    esewa: { clientId: '...', secret: '...' },
    stripe: { apiKey: 'sk_live_...' },
    // ...other gateways
  },
  customProviders: {
    stripe: new StripeGateway({ apiKey: 'sk_live_...' })
  }
});

// Listen to payment events
eventBus.on('pay', ({ gateway, params, result }) => {
  console.log(`Payment event from ${gateway}:`, result);
});

async function makeStripePayment() {
  const result = await sdk.pay({
    gateway: GatewayType.STRIPE,
    amount: 1000,
    currency: 'USD',
    returnUrl: 'https://yourapp.com/payment/callback',
  });
  console.log(result);
}

makeStripePayment();
```

## Multi-Currency & Payment Types
- All payment methods accept a `currency` parameter (e.g., 'USD', 'INR', 'NPR').
- Unified methods: `pay`, `verify`, `refund`, `subscribe`, `createInvoice`, `wallet` (where supported by provider).

## Event System
- Listen to events: `pay`, `verify`, `refund`, `subscribe`, `createInvoice`, `wallet`.
- Example:
  ```typescript
  eventBus.on('pay', ({ gateway, params, result }) => {
    // handle payment event
  });
  ```

## Adding/Using Providers
- Built-in: eSewa, Khalti, ConnectIPS, IME Pay, Mobile Banking
- Global: Stripe (with `StripeGateway`), more coming soon
- Register custom providers at runtime:
  ```typescript
  sdk.registerProvider('custom', new MyCustomGateway(...));
  ```

## Migration Guide
- Old: `sdk.pay({ gateway: GatewayType.ESEWA, ... })`
- New: Same, but now you can use any provider key (including global ones) and listen to events.
- All types are now unified and support multi-currency and new payment types.

## Examples
- [Basic Usage](examples/basic-usage.ts)
- [Express MVC Example](examples/express-server/README.md)
- [Frontend (React)](examples/frontend-react-usage.md)
- [Next.js](examples/nextjs-usage.md)

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## 📄 License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
