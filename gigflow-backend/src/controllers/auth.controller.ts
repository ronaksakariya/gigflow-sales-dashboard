import { Request, Response } from 'express';
import User from '../models/User.model';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { sendSuccess, sendError } from '../utils/response.util';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/token.util';
import { JwtPayload } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  const validated = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email: validated.email });
  if (existingUser) {
    sendError(res, 409, 'Email already exists');
    return;
  }

  const user = await User.create(validated);

  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const token = generateToken(payload);
  setTokenCookie(res, token);

  sendSuccess(res, 201, 'User registered successfully', {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const validated = loginSchema.parse(req.body);

  const user = await User.findOne({ email: validated.email }).select('+password');
  if (!user) {
    sendError(res, 401, 'Invalid credentials');
    return;
  }

  const isMatch = await user.comparePassword(validated.password);
  if (!isMatch) {
    sendError(res, 401, 'Invalid credentials');
    return;
  }

  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const token = generateToken(payload);
  setTokenCookie(res, token);

  sendSuccess(res, 200, 'Logged in successfully', {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  clearTokenCookie(res);
  sendSuccess(res, 200, 'Logged out successfully');
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.userId);
  if (!user) {
    sendError(res, 404, 'User not found');
    return;
  }

  sendSuccess(res, 200, 'User fetched successfully', {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });
};