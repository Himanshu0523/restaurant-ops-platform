import { Types } from 'mongoose';

export class StockAdjustedEvent {
  constructor(
    public readonly inventoryItemId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
    public readonly quantity: number,
  ) {}
}
