import { Types } from 'mongoose';

export class KitchenTicketReadyEvent {
  constructor(
    public readonly ticketId: Types.ObjectId,
    public readonly orderId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}
