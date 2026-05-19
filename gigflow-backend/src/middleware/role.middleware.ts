import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    sendError(res, 403, 'Forbidden, admin access required');
    return;
  }
  next();
};

export const requireSalesOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'sales')) {
    sendError(res, 403, 'Forbidden, sales or admin access required');
    return;
  }
  next();
};