import { Types } from 'mongoose';

export class OrderConfirmedEvent {
  constructor(
    public readonly orderId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}
