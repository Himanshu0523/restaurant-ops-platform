import { Types } from 'mongoose';

export class TableUpdatedEvent {
  constructor(
    public readonly tableId: Types.ObjectId,
    public readonly tenantId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}