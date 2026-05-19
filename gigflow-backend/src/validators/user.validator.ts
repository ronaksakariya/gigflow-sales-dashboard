import { z } from 'zod';
import { ROLES } from '../constants';

export const updateRoleSchema = z.object({
  role: z.enum([ROLES.ADMIN, ROLES.SALES], {
    message: 'Role must be admin or sales',
  }),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;