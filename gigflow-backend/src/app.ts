import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { CLIENT_ORIGIN } from './config/env';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);

app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;