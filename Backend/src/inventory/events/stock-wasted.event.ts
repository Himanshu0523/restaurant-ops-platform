import { Types } from 'mongoose';

export class StockWastedEvent {
  constructor(
    public readonly inventoryItemId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
    public readonly quantity: number,
    public readonly reason: string,
  ) {}
}
