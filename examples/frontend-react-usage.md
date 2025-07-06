# Example: Secure Frontend Usage of np-payment-sdk (React + Express)

## ⚠️ Never expose your secret keys in frontend code! Always use a backend API.

---

## 1. React Component (Frontend)

```jsx
// src/components/PayWithKhalti.js
import React, { useState } from 'react';

export default function PayWithKhalti() {
  const [status, setStatus] = useState('');

  const handlePay = async () => {
    setStatus('Processing...');
    // Call your backend API to initiate payment
    const res = await fetch('/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gateway: 'khalti',
        amount: 1000,
        currency: 'NPR',
        returnUrl: 'https://yourfrontend.com/payment/callback',
        transactionId: 'frontend-tx-1',
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
      // Redirect user to Khalti payment page
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

## 2. Express Backend API Route

```js
// backend/routes/pay.js
const express = require('express');
const router = express.Router();
const { PaymentSDK, GatewayType } = require('np-payment-sdk');

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

router.post('/pay', async (req, res) => {
  try {
    const payment = await sdk.pay({
      ...req.body,
      gateway: GatewayType.KHALTI,
    });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ status: 'failure', message: err.message });
  }
});

module.exports = router;
```

---

## 3. How the Flow Works

1. User clicks "Pay with Khalti" on the frontend.
2. Frontend calls `/api/pay` on your backend.
3. Backend uses `np-payment-sdk` to initiate the payment and returns the Khalti payment URL.
4. Frontend redirects the user to the Khalti payment page.

---

## 4. Webhook Handling (Optional)

Set up a webhook endpoint on your backend to receive payment status updates from Khalti and update your frontend UI accordingly. 