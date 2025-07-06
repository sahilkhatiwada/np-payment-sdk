import express from 'express';
import { PaymentSDK, GatewayType } from '../src';
import { paymentWebhookHandler } from '../src/handlers/webhook';
import { RequestHandler } from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Loads .env file if present

// Set your Khalti credentials in a .env file or environment variables:
// KHALTI_PUBLIC_KEY=your-live-public-key
// KHALTI_SECRET_KEY=your-live-secret-key

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

async function runDemo() {
  // Initiate a real Khalti payment
  const payment = await sdk.pay({
    gateway: GatewayType.KHALTI,
    amount: 1000, // in NPR
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
  console.log('Khalti Payment:', payment);

  // To verify, use the pidx from the payment response
  if (payment.params && payment.params.pidx) {
    const verify = await sdk.verify({
      gateway: GatewayType.KHALTI,
      transactionId: payment.params.pidx,
      amount: 1000 * 100, // in paisa
    });
    console.log('Khalti Verify:', verify);
  }

  // List all transactions
  const allTx = sdk.listTransactions();
  console.log('All Transactions:', allTx);
}

runDemo().catch((err) => {
  console.error('Error in runDemo:', err);
});

// Express webhook integration example
const app = express();
app.use(express.json());
app.post('/webhook', paymentWebhookHandler as RequestHandler);
app.listen(3000, () => console.log('Webhook server running on port 3000')); 