# Express Server Example (MVC)

This example demonstrates how to use `np-payment-sdk` in a maintainable, MVC-style Express server.

## Folder Structure

```
express-server/
  controllers/
    paymentController.ts      # Business logic for payments
  middlewares/
    validatePayment.ts        # Middleware for validating payment requests
  routes/
    paymentRoutes.ts          # Payment-related endpoints
    webhookRoutes.ts          # Webhook endpoint
  app.ts                      # Main entry point for the server
```

## How to Run

1. Install dependencies in the project root:
   ```bash
   npm install
   ```
2. Set up your environment variables (see below).
3. Run the example server:
   ```bash
   ts-node examples/express-server/app.ts
   # or compile and run with node
   # tsc && node dist/examples/express-server/app.js
   ```

## Environment Variables
Set these in a `.env` file or your environment:
- `PAYMENT_MODE` (sandbox | production)
- `ESEWA_CLIENT_ID`, `ESEWA_SECRET`
- `KHALTI_PUBLIC_KEY`, `KHALTI_SECRET_KEY`

## Endpoints
- `POST /api/pay` — Initiate a payment
- `POST /api/verify` — Verify a payment
- `POST /api/refund` — Refund a payment
- `GET /api/transactions` — List all transactions
- `POST /api/webhook` — Handle payment gateway webhooks

## Notes
- All business logic is in controllers.
- All validation is in middleware.
- Routes are clean and easy to extend.
- See `paymentController.ts` for how to use the SDK in a real app. 