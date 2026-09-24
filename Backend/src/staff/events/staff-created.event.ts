import { Types } from 'mongoose';

export class StaffCreatedEvent {
  constructor(
    public readonly staffId: Types.ObjectId,
    public readonly userId: Types.ObjectId,
    public readonly tenantId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}