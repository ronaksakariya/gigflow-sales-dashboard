import { Request, Response } from 'express';
import Lead from '../models/Lead.model';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validators/lead.validator';
import { sendSuccess, sendError } from '../utils/response.util';
import { generateCSV } from '../utils/csv.util';
import { PAGINATION } from '../constants';
import { PaginationMeta, LeadFilters } from '../types';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  const validated = createLeadSchema.parse(req.body);

  const lead = await Lead.create({
    name: validated.name,
    email: validated.email,
    source: validated.source,
    ...(validated.status && { status: validated.status }),
    createdBy: req.user!.userId,
  });

  sendSuccess(res, 201, 'Lead created successfully', lead);
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  const validated = leadQuerySchema.parse(req.query) as LeadFilters;

  const page = validated.page || PAGINATION.DEFAULT_PAGE;
  const limit = validated.limit || PAGINATION.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (validated.status) {
    filter.status = validated.status;
  }
  if (validated.source) {
    filter.source = validated.source;
  }
  if (validated.search) {
    filter.$or = [
      { name: { $regex: validated.search, $options: 'i' } },
      { email: { $regex: validated.search, $options: 'i' } },
    ];
  }

  const sortOption: Record<string, 1 | -1> = validated.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort(sortOption).skip(skip).limit(limit).populate('createdBy'),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  const meta: PaginationMeta = {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  sendSuccess(res, 200, 'Leads fetched successfully', leads, meta);
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id).populate('createdBy');
  if (!lead) {
    sendError(res, 404, 'Lead not found');
    return;
  }

  sendSuccess(res, 200, 'Lead fetched successfully', lead);
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const validated = updateLeadSchema.parse(req.body);

  const lead = await Lead.findByIdAndUpdate(req.params.id, validated, {
    new: true,
    runValidators: true,
  });

  if (!lead) {
    sendError(res, 404, 'Lead not found');
    return;
  }

  sendSuccess(res, 200, 'Lead updated successfully', lead);
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    sendError(res, 404, 'Lead not found');
    return;
  }

  sendSuccess(res, 200, 'Lead deleted successfully');
};

export const exportLeads = async (req: Request, res: Response): Promise<void> => {
  const validated = leadQuerySchema.parse(req.query) as LeadFilters;

  const filter: Record<string, unknown> = {};

  if (validated.status) {
    filter.status = validated.status;
  }
  if (validated.source) {
    filter.source = validated.source;
  }
  if (validated.search) {
    filter.$or = [
      { name: { $regex: validated.search, $options: 'i' } },
      { email: { $regex: validated.search, $options: 'i' } },
    ];
  }

  const sortOption: Record<string, 1 | -1> = validated.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const leads = await Lead.find(filter).sort(sortOption);

  const csv = generateCSV(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="gigflow-leads.csv"');
  res.status(200).send(csv);
};