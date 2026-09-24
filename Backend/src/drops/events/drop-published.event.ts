import { Types } from 'mongoose';

export class DropPublishedEvent {
  constructor(
    public readonly dropId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}
