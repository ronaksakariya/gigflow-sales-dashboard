import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import { PORT } from './config/env';

const start = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`GigFlow API running on port ${PORT}`);
  });

  return server;
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export { start };
export default app;