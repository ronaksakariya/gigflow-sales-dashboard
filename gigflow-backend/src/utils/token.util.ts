import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { JwtPayload } from '../types';
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from '../config/env';
import { COOKIE_NAME } from '../constants';

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function setTokenCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearTokenCookie(res: Response): void {
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: NODE_ENV === 'production',
    expires: new Date(0),
  });
}