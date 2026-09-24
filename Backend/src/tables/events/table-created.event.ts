import { Types } from 'mongoose';

export class TableCreatedEvent {
  constructor(
    public readonly tableId: Types.ObjectId,
    public readonly tenantId: Types.ObjectId,
    public readonly restaurantId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}