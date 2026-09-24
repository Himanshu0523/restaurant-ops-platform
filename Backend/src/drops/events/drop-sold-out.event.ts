import { Types } from 'mongoose';

export class DropSoldOutEvent {
  constructor(
    public readonly dropId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}
