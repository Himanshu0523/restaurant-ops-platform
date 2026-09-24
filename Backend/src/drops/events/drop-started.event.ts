import { Types } from 'mongoose';

export class DropStartedEvent {
  constructor(
    public readonly dropId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}
