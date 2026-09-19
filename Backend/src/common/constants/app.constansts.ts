export const APP_CONSTANTS = {
  REQUEST_ID_HEADER: 'x-request-id',
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  OWNER: 'owner',
  MANAGER: 'manager',
  STAFF: 'staff',
  CUSTOMER: 'customer',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];