import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NODE_ENV: string;
  CLIENT_ORIGIN: string;
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const env: EnvConfig = {
  PORT: Number(getEnvVar('PORT')) || 5000,
  MONGO_URI: getEnvVar('MONGO_URI'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: getEnvVar('CLIENT_ORIGIN'),
};

export const { PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV, CLIENT_ORIGIN } = env;