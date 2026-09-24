export const DROP_DEFAULTS = {
  INITIAL_REMAINING_QUANTITY: 0,
  SORT_ORDER: 0,
} as const;

export const DROP_LIMITS = {
  MAX_QUANTITY: 1_000_000,
  MAX_DURATION_HOURS: 168,
} as const;
