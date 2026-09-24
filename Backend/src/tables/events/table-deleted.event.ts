import { Types } from 'mongoose';

export class TableDeletedEvent {
  constructor(
    public readonly tableId: Types.ObjectId,
    public readonly tenantId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}