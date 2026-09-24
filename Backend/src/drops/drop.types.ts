import { Types } from 'mongoose';

export enum DropStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  SOLD_OUT = 'SOLD_OUT',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export enum DropType {
  LIMITED_QUANTITY = 'LIMITED_QUANTITY',
  SPECIAL_DISH = 'SPECIAL_DISH',
  FLASH = 'FLASH',
  SEASONAL = 'SEASONAL',
  EVENT = 'EVENT',
}

export enum DropAvailability {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY',
}

export interface DropContext {
  tenantId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  performedBy: Types.ObjectId;
}
