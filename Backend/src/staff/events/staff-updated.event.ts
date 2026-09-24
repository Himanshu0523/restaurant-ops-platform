import { Types } from 'mongoose';

export class StaffUpdatedEvent {
  constructor(
    public readonly staffId: Types.ObjectId,
    public readonly tenantId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}