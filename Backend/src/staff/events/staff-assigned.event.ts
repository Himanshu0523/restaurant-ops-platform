import { Types } from 'mongoose';

export class StaffAssignedEvent {
  constructor(
    public readonly staffId: Types.ObjectId,
    public readonly userId: Types.ObjectId,
    public readonly tenantId: Types.ObjectId,
    public readonly previousBranchId: Types.ObjectId,
    public readonly newBranchId: Types.ObjectId,
  ) {}
}