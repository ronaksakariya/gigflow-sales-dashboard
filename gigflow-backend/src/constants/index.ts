export const ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
} as const;

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;

export const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'] as const;

export const COOKIE_NAME = 'gigflow_token';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;