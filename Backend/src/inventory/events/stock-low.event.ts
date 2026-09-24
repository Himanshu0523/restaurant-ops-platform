import { Types } from 'mongoose';

export class StockLowEvent {
  constructor(
    public readonly inventoryItemId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
    public readonly availableQuantity: number,
  ) {}
}
