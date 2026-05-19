import { Request, Response } from 'express';
import User from '../models/User.model';
import { sendSuccess, sendError } from '../utils/response.util';
import { updateRoleSchema } from '../validators/user.validator';

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find().select('name email role createdAt').sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Users fetched successfully', users);
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  const validated = updateRoleSchema.parse(req.body);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: validated.role },
    { new: true, runValidators: true },
  ).select('name email role');

  if (!user) {
    sendError(res, 404, 'User not found');
    return;
  }

  sendSuccess(res, 200, 'User role updated successfully', {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });
};