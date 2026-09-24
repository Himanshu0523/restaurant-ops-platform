import { Types } from 'mongoose';

export class StockReceivedEvent {
  constructor(
    public readonly inventoryItemId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
    public readonly quantity: number,
  ) {}
}
