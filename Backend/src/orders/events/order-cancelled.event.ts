import { Types } from 'mongoose';

export class OrderCancelledEvent {
  constructor(
    public readonly orderId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
    public readonly reason: string,
  ) {}
}
