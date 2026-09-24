import { Types } from 'mongoose';

export class KitchenTicketStartedEvent {
  constructor(
    public readonly ticketId: Types.ObjectId,
    public readonly orderId: Types.ObjectId,
  ) {}
}
