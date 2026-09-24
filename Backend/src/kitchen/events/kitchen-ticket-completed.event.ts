import { Types } from 'mongoose';

export class KitchenTicketCompletedEvent {
  constructor(
    public readonly ticketId: Types.ObjectId,
    public readonly orderId: Types.ObjectId,
  ) {}
}
