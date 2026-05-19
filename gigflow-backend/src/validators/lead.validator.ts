import { z } from 'zod';
import { LEAD_STATUSES, LEAD_SOURCES } from '../constants';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;