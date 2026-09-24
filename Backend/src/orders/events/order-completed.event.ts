import { Types } from 'mongoose';

export class OrderCompletedEvent {
  constructor(
    public readonly orderId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}
