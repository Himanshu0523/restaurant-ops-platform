import { Types } from 'mongoose';

export class DropCreatedEvent {
  constructor(
    public readonly dropId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}
