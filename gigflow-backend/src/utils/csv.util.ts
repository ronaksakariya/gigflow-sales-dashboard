import { ILeadDocument } from '../models/Lead.model';

function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function generateCSV(leads: ILeadDocument[]): string {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => {
    const name = escapeCSVField(lead.name);
    const email = escapeCSVField(lead.email);
    const status = escapeCSVField(lead.status);
    const source = escapeCSVField(lead.source);
    const createdAt = escapeCSVField(new Date(lead.createdAt).toLocaleString());
    return [name, email, status, source, createdAt].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}