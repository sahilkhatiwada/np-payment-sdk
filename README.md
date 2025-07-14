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
- PayPal (global)
- Razorpay, Cashfree, Flutterwave, Paystack

## Gateway Configuration & Usage

Below are examples for each supported payment gateway.  
**Note:** Never expose secret keys in frontend code. Always use these in your backend.

---

### **eSewa**
```js
const sdk = new PaymentSDK({
  gateways: {
    esewa: {
      clientId: 'YOUR_ESEWA_CLIENT_ID',
      secret: 'YOUR_ESEWA_SECRET',
      // baseUrl: 'https://uat.esewa.com.np' // optional, for sandbox/live
    }
  }
});
```
- **Supports:** pay, verify, refund

---

### **Khalti**
```js
const sdk = new PaymentSDK({
  gateways: {
    khalti: {
      publicKey: 'YOUR_KHALTI_PUBLIC_KEY',
      secretKey: 'YOUR_KHALTI_SECRET_KEY',
      // baseUrl: 'https://khalti.com/api/v2' // optional
    }
  }
});
```
- **Supports:** pay, verify, refund

---

### **ConnectIPS**
```js
const sdk = new PaymentSDK({
  gateways: {
    connectips: {
      clientId: 'YOUR_CONNECTIPS_CLIENT_ID',
      secret: 'YOUR_CONNECTIPS_SECRET',
      // baseUrl: 'https://uat.connectips.com' // optional
    }
  }
});
```
- **Supports:** pay, verify, refund

---

### **IME Pay**
```js
const sdk = new PaymentSDK({
  gateways: {
    imepay: {
      merchantCode: 'YOUR_IMEPAY_MERCHANT_CODE',
      apiKey: 'YOUR_IMEPAY_API_KEY',
      // baseUrl: 'https://staging.imepay.com.np' // optional
    }
  }
});
```
- **Supports:** pay, verify, refund

---

### **Mobile Banking**
```js
const sdk = new PaymentSDK({
  gateways: {
    mobilebanking: {
      bankId: 'YOUR_BANK_ID',
      apiKey: 'YOUR_BANK_API_KEY',
      // baseUrl: 'https://api.mobilebanking.com.np' // optional
    }
  }
});
```
- **Supports:** pay, verify, refund

---

### **Stripe (Global)**
```js
const sdk = new PaymentSDK({
  gateways: {
    stripe: {
      apiKey: 'sk_live_...' // Secret key from Stripe dashboard
    }
  }
});
```
- **Supports:** pay, verify, refund, subscription, invoice

---

### **PayPal (Global)**
```js
const sdk = new PaymentSDK({
  gateways: {
    paypal: {
      clientId: 'YOUR_PAYPAL_CLIENT_ID',
      clientSecret: 'YOUR_PAYPAL_CLIENT_SECRET',
      environment: 'sandbox' // or 'production'
    }
  }
});
```
- **Supports:** pay, verify, refund

---

### **Razorpay (Global)**
```js
const sdk = new PaymentSDK({
  gateways: {
    razorpay: {
      keyId: 'YOUR_RAZORPAY_KEY_ID',
      keySecret: 'YOUR_RAZORPAY_KEY_SECRET'
    }
  }
});
```
- **Supports:** pay, verify, refund, subscription, invoice

---

### **Cashfree (Global)**
```js
const sdk = new PaymentSDK({
  gateways: {
    cashfree: {
      clientId: 'YOUR_CASHFREE_CLIENT_ID',
      clientSecret: 'YOUR_CASHFREE_CLIENT_SECRET',
      environment: 'TEST' // or 'PROD'
    }
  }
});
```
- **Supports:** pay, verify, refund

---

### **Flutterwave (Global)**
```js
const sdk = new PaymentSDK({
  gateways: {
    flutterwave: {
      publicKey: 'YOUR_FLUTTERWAVE_PUBLIC_KEY',
      secretKey: 'YOUR_FLUTTERWAVE_SECRET_KEY',
      encryptionKey: 'YOUR_FLUTTERWAVE_ENCRYPTION_KEY'
    }
  }
});
```
- **Supports:** pay, verify, refund

---

### **Paystack (Global)**
```js
const sdk = new PaymentSDK({
  gateways: {
    paystack: {
      secretKey: 'YOUR_PAYSTACK_SECRET_KEY'
    }
  }
});
```
- **Supports:** pay, verify, refund

---

## Usage Pattern (All Gateways)
```js
// Initiate a payment
const result = await sdk.pay({
  gateway: 'esewa', // or 'khalti', 'stripe', etc.
  amount: 1000,
  currency: 'NPR', // or 'USD', 'INR', etc.
  returnUrl: 'https://yourapp.com/payment/callback',
  // ...other params as required by the gateway
});
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
