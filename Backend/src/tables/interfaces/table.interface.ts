import { Types } from 'mongoose';
import {
  TableShape,
  TableStatus,
  TableType,
} from '../tables.types.js';

export interface ITable {
  _id: Types.ObjectId;

  tenantId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;

  tableNumber: string;
  label?: string;
  description?: string;

  type: TableType;
  shape: TableShape;

  capacity: number;
  minCapacity?: number;
  maxCapacity?: number;

  status: TableStatus;

  floor?: string;
  zone?: string;

  qrCodeToken?: string;
  qrCodeUrl?: string;

  currentOrderId?: Types.ObjectId | null;
  currentReservationId?: Types.ObjectId | null;

  isActive: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}