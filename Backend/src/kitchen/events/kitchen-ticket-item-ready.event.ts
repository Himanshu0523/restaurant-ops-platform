import { Types } from 'mongoose';

export class KitchenTicketItemReadyEvent {
  constructor(
    public readonly ticketId: Types.ObjectId,
    public readonly itemId: Types.ObjectId,
  ) {}
}
