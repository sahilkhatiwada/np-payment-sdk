# Example: Next.js API Route & Frontend for np-payment-sdk (Khalti)

## 1. API Route: `/pages/api/pay.js`

```js
// pages/api/pay.js
import { PaymentSDK, GatewayType } from 'np-payment-sdk';

const sdk = new PaymentSDK({
  mode: 'production',
  gateways: {
    khalti: {
      publicKey: process.env.KHALTI_PUBLIC_KEY,
      secretKey: process.env.KHALTI_SECRET_KEY,
      baseUrl: 'https://khalti.com/api/v2',
    },
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const payment = await sdk.pay({
      ...req.body,
      gateway: GatewayType.KHALTI,
    });
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ status: 'failure', message: err.message });
  }
}
```

---

## 2. Next.js Frontend Page: `/pages/pay.js`

```jsx
// pages/pay.js
import { useState } from 'react';

export default function PayPage() {
  const [status, setStatus] = useState('');

  const handlePay = async () => {
    setStatus('Processing...');
    const res = await fetch('/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000,
        currency: 'NPR',
        returnUrl: 'https://yourfrontend.com/payment/callback',
        transactionId: 'next-tx-1',
        purchaseOrderName: 'Test Order',
        customerInfo: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '9800000000',
        },
      }),
    });
    const data = await res.json();
    if (data.status === 'success' && data.params && data.params.payment_url) {
      window.location.href = data.params.payment_url;
    } else {
      setStatus('Payment initiation failed: ' + (data.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <button onClick={handlePay}>Pay with Khalti</button>
      <div>{status}</div>
    </div>
  );
}
```

---

## 3. How the Flow Works

1. User visits `/pay` and clicks "Pay with Khalti".
2. Frontend calls `/api/pay` (the Next.js API route).
3. API route uses `np-payment-sdk` to initiate the payment and returns the Khalti payment URL.
4. Frontend redirects the user to the Khalti payment page.

---

## 4. Webhook Handling (Optional)

Set up a Next.js API route (e.g., `/api/webhook`) to receive payment status updates from Khalti and update your frontend UI accordingly. 