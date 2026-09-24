export const PAYMENT_NUMBER_PREFIX = 'PAY';

export const REFUND_NUMBER_PREFIX = 'REF';

export const DEFAULT_CURRENCY = 'INR';

export const PAYMENT_ACTIVE_STATUSES = [
  'CREATED',
  'PENDING',
  'PROCESSING',
  'AUTHORIZED',
] as const;

export const PAYMENT_TERMINAL_STATUSES = [
  'CAPTURED',
  'FAILED',
  'CANCELLED',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
] as const;

export const REFUNDABLE_STATUSES = [
  'CAPTURED',
  'PARTIALLY_REFUNDED',
] as const;

export const MAX_REFUND_ATTEMPTS = 3;
