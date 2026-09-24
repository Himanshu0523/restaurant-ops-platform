import { Types } from 'mongoose';

import { StaffStatus } from '../staff.types.js';

export class StaffStatusChangedEvent {
  constructor(
    public readonly staffId: Types.ObjectId,
    public readonly tenantId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
    public readonly previousStatus: StaffStatus,
    public readonly newStatus: StaffStatus,
  ) {}
}