import {
  ReservationSource,
  ReservationStatus,
  ReservationTablePreference,
} from '../reservation.types.js';

export interface GuestSnapshotResponse {
  name?: string;
  phone?: string;
  email?: string;
}

export interface ReservationResponse {
  id: string;
  tenantId: string;
  restaurantId: string;
  branchId: string;
  customerId?: string;
  tableId?: string;
  reservationNumber: string;
  guestCount: number;
  startAt: Date;
  endAt: Date;
  durationMinutes: number;
  status: ReservationStatus;
  source: ReservationSource;
  guest?: GuestSnapshotResponse;
  preferences?: {
    preferences: ReservationTablePreference[];
  };
  specialRequests?: string;
  cancellationReason?: string;
  checkedInAt?: Date;
  seatedAt?: Date;
  completedAt?: Date;
  noShowAt?: Date;
  createdBy?: string;
  assignedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailableTableResponse {
  id: string;
  tableNumber: string;
  capacity: number;
  minCapacity?: number;
  maxCapacity?: number;
  type: string;
  shape: string;
  floor?: string;
  isVip?: boolean;
}

export interface AvailabilityResponse {
  startAt: Date;
  endAt: Date;
  durationMinutes: number;
  guestCount: number;
  availableTables: AvailableTableResponse[];
  totalAvailable: number;
}
