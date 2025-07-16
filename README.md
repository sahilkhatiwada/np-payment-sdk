# NP Payment SDK

A modern, type-safe Node.js/TypeScript SDK for integrating with multiple global payment gateways (Stripe, Razorpay, Paystack, Flutterwave, Cashfree, PayPal) via a unified interface.

---

## Features
- Unified API for multiple payment gateways
- TypeScript-first, fully type-safe
- Easy to extend and customize
- Production-ready, linter/test/CI clean

---

## Installation

```bash
npm install np-payment-sdk
# or
yarn add np-payment-sdk
```

---

## Usage Example

```typescript
import { PaymentSDK } from 'np-payment-sdk';

const sdk = new PaymentSDK({
  gateways: {
    stripe: { publicKey: 'pk_test_...', secretKey: 'sk_test_...' },
    razorpay: { keyId: 'rzp_test_...', keySecret: '...' },
    // ...other gateways
  }
});

// Initiate a payment
const result = await sdk.pay('stripe', {
  amount: 100,
  currency: 'USD',
  cardNumber: '4242424242424242',
  expiryMonth: '12',
  expiryYear: '2025',
  cvv: '123',
  fullname: 'John Doe',
  email: 'john@example.com',
});

console.log(result);
```

---

## Full Usage Example

```typescript
import { PaymentSDK } from 'np-payment-sdk';

// 1. Initialize the SDK with your gateway configs
const sdk = new PaymentSDK({
  gateways: {
    stripe: { publicKey: 'pk_test_...', secretKey: 'sk_test_...' },
    razorpay: { keyId: 'rzp_test_...', keySecret: '...' },
    paystack: { secretKey: 'sk_test_...' },
    flutterwave: {
      publicKey: 'FLWPUBK_TEST-...',
      secretKey: 'FLWSECK_TEST-...',
      encryptionKey: 'FLWENCK_TEST-...'
    },
    cashfree: { clientId: 'CF_CLIENT_ID', clientSecret: 'CF_SECRET', environment: 'TEST' },
    paypal: { clientId: 'PAYPAL_CLIENT_ID', clientSecret: 'PAYPAL_SECRET', environment: 'sandbox' },
  }
});

// 2. Make a payment (Stripe example)
const payResult = await sdk.pay('stripe', {
  amount: 100,
  currency: 'USD',
  cardNumber: '4242424242424242',
  expiryMonth: '12',
  expiryYear: '2025',
  cvv: '123',
  fullname: 'John Doe',
  email: 'john@example.com',
});

if (payResult.status === 'success') {
  console.log('Payment successful:', payResult.params);
} else {
  console.error('Payment failed:', payResult.message, payResult.params);
}

// 3. Verify a payment
const verifyResult = await sdk.verify('stripe', { transactionId: 'txn_123' });
if (verifyResult.status === 'success') {
  console.log('Verification successful:', verifyResult.params);
} else {
  console.error('Verification failed:', verifyResult.message, verifyResult.params);
}

// 4. Refund a payment
const refundResult = await sdk.refund('stripe', { transactionId: 'txn_123', amount: 100 });
if (refundResult.status === 'success') {
  console.log('Refund successful:', refundResult.params);
} else {
  console.error('Refund failed:', refundResult.message, refundResult.params);
}
```

---

## Advanced Usage Examples

### Subscriptions (where supported)
```typescript
// Create a subscription (Stripe or Razorpay example)
const subResult = await sdk.subscribe('stripe', {
  planId: 'plan_123',
  customerId: 'cus_123',
});
if (subResult.status === 'active') {
  console.log('Subscription active:', subResult.params);
} else {
  console.error('Subscription failed:', subResult.message, subResult.params);
}
```

### Invoices (where supported)
```typescript
// Create an invoice (Stripe or Razorpay example)
const invoiceResult = await sdk.createInvoice('stripe', {
  amount: 100,
  currency: 'USD',
  customerId: 'cus_123',
});
if (invoiceResult.status === 'created') {
  console.log('Invoice created:', invoiceResult.params);
} else {
  console.error('Invoice creation failed:', invoiceResult.message, invoiceResult.params);
}
```

### Event Handling (if supported)
```typescript
// Listen for payment events (if your SDK exposes an event bus)
sdk.eventBus?.on('pay', ({ gateway, params, result }) => {
  console.log(`Payment event for ${gateway}:`, result);
});
```

### Custom Gateway Registration
```typescript
import { IPaymentGateway } from 'np-payment-sdk';

class MyCustomGateway implements IPaymentGateway {
  async pay(params) { /* ... */ }
  async verify(params) { /* ... */ }
  async refund(params) { /* ... */ }
  // ...other methods as needed
}

sdk.registerProvider('mycustom', new MyCustomGateway(/* config */));
// Now you can use: await sdk.pay('mycustom', { ... })
```

### Environment Variables & Secrets

**Best practice:** Store all sensitive keys in environment variables and load them in your config:

```typescript
const sdk = new PaymentSDK({
  gateways: {
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY!,
      secretKey: process.env.STRIPE_SECRET_KEY!,
    },
    // ...other gateways
  }
});
```

- Use a `.env` file and a package like `dotenv` to load variables in development.
- Never commit secrets to version control.

---

## Usage by Gateway

### Stripe
```typescript
import { PaymentSDK } from 'np-payment-sdk';

const sdk = new PaymentSDK({
  gateways: {
    stripe: { publicKey: 'pk_test_...', secretKey: 'sk_test_...' },
  }
});

// Pay
await sdk.pay('stripe', { /* ...params... */ });
// Verify
await sdk.verify('stripe', { transactionId: '...' });
// Refund
await sdk.refund('stripe', { transactionId: '...', amount: 100 });
// Subscription
await sdk.subscribe('stripe', { planId: 'plan_123', customerId: 'cus_123' });
// Invoice
await sdk.createInvoice('stripe', { amount: 100, currency: 'USD', customerId: 'cus_123' });
// Wallet (not supported)
```

---

### Razorpay
```typescript
const sdk = new PaymentSDK({
  gateways: {
    razorpay: { keyId: 'rzp_test_...', keySecret: '...' },
  }
});

// Pay
await sdk.pay('razorpay', { /* ...params... */ });
// Verify
await sdk.verify('razorpay', { transactionId: '...' });
// Refund
await sdk.refund('razorpay', { transactionId: '...', amount: 100 });
// Subscription
await sdk.subscribe('razorpay', { planId: 'plan_123', customerId: 'cus_123' });
// Invoice
await sdk.createInvoice('razorpay', { amount: 100, currency: 'INR', customerId: 'cus_123' });
// Wallet (not supported)
```

---

### Paystack
```typescript
const sdk = new PaymentSDK({
  gateways: {
    paystack: { secretKey: 'sk_test_...' },
  }
});

// Pay
await sdk.pay('paystack', { /* ...params... */ });
// Verify
await sdk.verify('paystack', { transactionId: '...' });
// Refund
await sdk.refund('paystack', { transactionId: '...', amount: 100 });
// Subscription/Invoice/Wallet (not supported)
```

---

### Flutterwave
```typescript
const sdk = new PaymentSDK({
  gateways: {
    flutterwave: {
      publicKey: 'FLWPUBK_TEST-...',
      secretKey: 'FLWSECK_TEST-...',
      encryptionKey: 'FLWENCK_TEST-...'
    },
  }
});

// Pay
await sdk.pay('flutterwave', { /* ...params... */ });
// Verify
await sdk.verify('flutterwave', { transactionId: '...' });
// Refund
await sdk.refund('flutterwave', { transactionId: '...', amount: 100 });
// Subscription/Invoice/Wallet (not supported)
```

---

### Cashfree
```typescript
const sdk = new PaymentSDK({
  gateways: {
    cashfree: { clientId: 'CF_CLIENT_ID', clientSecret: 'CF_SECRET', environment: 'TEST' },
  }
});

// Pay
await sdk.pay('cashfree', { /* ...params... */ });
// Verify
await sdk.verify('cashfree', { transactionId: '...' });
// Refund
await sdk.refund('cashfree', { transactionId: '...', amount: 100 });
// Subscription/Invoice/Wallet (not supported)
```

---

### PayPal
```typescript
const sdk = new PaymentSDK({
  gateways: {
    paypal: { clientId: 'PAYPAL_CLIENT_ID', clientSecret: 'PAYPAL_SECRET', environment: 'sandbox' },
  }
});

// Pay
await sdk.pay('paypal', { /* ...params... */ });
// Verify
await sdk.verify('paypal', { transactionId: '...' });
// Refund
await sdk.refund('paypal', { transactionId: '...', amount: 100 });
// Subscription/Invoice/Wallet (not supported)
```

---

## Method Parameters

### pay
| Parameter      | Type    | Description                       |
|---------------|---------|-----------------------------------|
| amount        | number  | Amount to charge                  |
| currency      | string  | Currency code (e.g., 'USD')       |
| cardNumber    | string  | Card number (if applicable)       |
| expiryMonth   | string  | Card expiry month (if applicable) |
| expiryYear    | string  | Card expiry year (if applicable)  |
| cvv           | string  | Card CVV (if applicable)          |
| fullname      | string  | Cardholder name                   |
| email         | string  | Customer email                    |
| transactionId | string  | (Optional) Transaction reference  |
| returnUrl     | string  | (Optional) Redirect/callback URL  |
| ...           | ...     | Other gateway-specific params     |

### verify
| Parameter      | Type    | Description                       |
|---------------|---------|-----------------------------------|
| transactionId  | string  | Transaction reference/ID          |
| ...            | ...     | Other gateway-specific params     |

### refund
| Parameter      | Type    | Description                       |
|---------------|---------|-----------------------------------|
| transactionId  | string  | Transaction reference/ID          |
| amount         | number  | Amount to refund                  |
| ...            | ...     | Other gateway-specific params     |

### subscribe (where supported)
| Parameter      | Type    | Description                       |
|---------------|---------|-----------------------------------|
| planId         | string  | Subscription plan ID              |
| customerId     | string  | Customer ID                       |
| ...            | ...     | Other gateway-specific params     |

### createInvoice (where supported)
| Parameter      | Type    | Description                       |
|---------------|---------|-----------------------------------|
| amount         | number  | Invoice amount                    |
| currency       | string  | Currency code                     |
| customerId     | string  | Customer ID                       |
| ...            | ...     | Other gateway-specific params     |

---

## Advanced Usage

### Error Handling
All methods return a result object with `status`, `params`, and `message`. Always check `status`:

```typescript
const result = await sdk.pay('stripe', { ... });
if (result.status === 'success') {
  // handle success
} else {
  // handle failure
  console.error(result.message, result.params);
}
```

### Custom Gateway Integration
You can add your own gateway by implementing the `IPaymentGateway` interface:

```typescript
import { IPaymentGateway } from 'np-payment-sdk';

class MyCustomGateway implements IPaymentGateway {
  // implement pay, verify, refund, etc.
}

sdk.registerProvider('mycustom', new MyCustomGateway(/* config */));
```

---

## Event System (if supported)
If your SDK supports events, you can listen for payment lifecycle events:

```typescript
eventBus.on('pay', ({ gateway, params, result }) => {
  // handle payment event
});
```

---

## Security Best Practices
- **Never expose secret keys in frontend code.** Always use them in your backend/server.
- Use environment variables to manage secrets and configuration.
- Rotate keys regularly and follow gateway provider security guidelines.

---

## Supported Gateways
- Stripe
- Razorpay
- Paystack
- Flutterwave
- Cashfree
- PayPal

---

## Testing

```bash
npm test
```

---

## Linting

```bash
npm run lint
```

---

## Contributing

1. Fork the repo and create your branch from `master`.
2. Ensure code is linter/test/CI clean before submitting a PR.
3. Add/Update tests for new features or bug fixes.

---

## License

MIT
