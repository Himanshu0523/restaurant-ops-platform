import { Types } from 'mongoose';
import { TableStatus } from '../tables.types.js';

export class TableStatusChangedEvent {
  constructor(
    public readonly tableId: Types.ObjectId,
    public readonly tenantId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
    public readonly previousStatus: TableStatus,
    public readonly newStatus: TableStatus,
  ) {}
}