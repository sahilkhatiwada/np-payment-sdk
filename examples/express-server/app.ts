import express from 'express';
import paymentRoutes from './routes/paymentRoutes';
import webhookRoutes from './routes/webhookRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());
app.use('/api', paymentRoutes);
app.use('/api', webhookRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 