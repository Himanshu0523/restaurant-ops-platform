import { Types } from 'mongoose';

export class OrderReadyEvent {
  constructor(
    public readonly orderId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}
