import { Types } from 'mongoose';

export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  INACTIVE = 'INACTIVE',
}

export enum InventoryMovementType {
  RECEIPT = 'RECEIPT',
  SALE_CONSUMPTION = 'SALE_CONSUMPTION',
  ADJUSTMENT_IN = 'ADJUSTMENT_IN',
  ADJUSTMENT_OUT = 'ADJUSTMENT_OUT',
  WASTE = 'WASTE',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  RETURN = 'RETURN',
  RESERVATION = 'RESERVATION',
  RESERVATION_RELEASE = 'RESERVATION_RELEASE',
}

export enum InventoryLotStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  DEPLETED = 'DEPLETED',
  BLOCKED = 'BLOCKED',
}

export enum InventoryReferenceType {
  ORDER = 'ORDER',
  PURCHASE = 'PURCHASE',
  WASTE = 'WASTE',
  TRANSFER = 'TRANSFER',
  MANUAL = 'MANUAL',
  RESERVATION = 'RESERVATION',
}

export interface InventoryQuantity {
  currentQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}

export interface InventoryContext {
  tenantId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  performedBy: Types.ObjectId;
}
