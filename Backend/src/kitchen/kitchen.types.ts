import { Types } from 'mongoose';

export enum KitchenTicketStatus {
  QUEUED = 'QUEUED',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  PARTIALLY_READY = 'PARTIALLY_READY',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum KitchenTicketItemStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  CANCELLED = 'CANCELLED',
}

export enum KitchenPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum KitchenStationType {
  GRILL = 'GRILL',
  CURRY = 'CURRY',
  FRY = 'FRY',
  TANDOOR = 'TANDOOR',
  BEVERAGE = 'BEVERAGE',
  DESSERT = 'DESSERT',
  COLD = 'COLD',
  PACKING = 'PACKING',
  GENERAL = 'GENERAL',
}

export interface KitchenContext {
  tenantId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  performedBy: Types.ObjectId;
}
