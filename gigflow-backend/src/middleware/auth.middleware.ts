import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '../constants';
import { JWT_SECRET } from '../config/env';
import { JwtPayload } from '../types';
import { sendError } from '../utils/response.util';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    sendError(res, 401, 'Not authorized, no token');
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, 401, 'Token expired');
      return;
    }
    sendError(res, 401, 'Not authorized, invalid token');
  }
};