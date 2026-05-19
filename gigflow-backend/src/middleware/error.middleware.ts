import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { NODE_ENV } from '../config/env';
import { sendError } from '../utils/response.util';

interface DuplicateKeyError extends Error {
  code: 11000;
  keyValue: Record<string, string>;
}

function formatZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    errors[path || 'root'] = issue.message;
  }
  return errors;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    sendError(res, 400, 'Validation failed', formatZodErrors(err));
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string> = {};
    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
    sendError(res, 400, 'Validation failed', errors);
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    sendError(res, 400, 'Invalid ID format');
    return;
  }

  if ((err as unknown as DuplicateKeyError).code === 11000) {
    const field = Object.keys((err as unknown as DuplicateKeyError).keyValue)[0];
    sendError(res, 409, `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    sendError(res, 401, 'Invalid token');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 401, 'Token expired');
    return;
  }

  const message = NODE_ENV === 'development' ? err.message : 'Internal server error';
  const response: { success: boolean; message: string; stack?: string } = {
    success: false,
    message,
  };

  if (NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(500).json(response);
};