import { Types } from 'mongoose';

export class OrderItemAddedEvent {
  constructor(
    public readonly orderId: Types.ObjectId,
    public readonly menuItemId: Types.ObjectId,
  ) {}
}
