export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  SEATED = 'SEATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  EXPIRED = 'EXPIRED',
}

export enum ReservationSource {
  CUSTOMER_APP = 'CUSTOMER_APP',
  WEB = 'WEB',
  STAFF = 'STAFF',
  PHONE = 'PHONE',
  WALK_IN = 'WALK_IN',
  ADMIN = 'ADMIN',
}

export enum ReservationTablePreference {
  ANY = 'ANY',
  WINDOW = 'WINDOW',
  OUTDOOR = 'OUTDOOR',
  QUIET = 'QUIET',
  BOOTH = 'BOOTH',
  PRIVATE_ROOM = 'PRIVATE_ROOM',
}

export interface ReservationTimeRange {
  startAt: Date;
  endAt: Date;
}
