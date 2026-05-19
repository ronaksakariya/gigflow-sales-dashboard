import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { ILead, LeadStatus, LeadSource } from '../types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../constants';

export interface ILeadDocument extends Omit<ILead, 'createdBy'>, Document {
  createdBy: Types.ObjectId;
}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES as unknown as LeadStatus[],
        message: 'Invalid lead status',
      },
      default: 'New',
    },
    source: {
      type: String,
      enum: {
        values: LEAD_SOURCES as unknown as LeadSource[],
        message: 'Invalid lead source',
      },
      required: [true, 'Source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'CreatedBy is required'],
    } as any,
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text' });

const Lead: Model<ILeadDocument> = mongoose.model<ILeadDocument>('Lead', leadSchema);

export default Lead;