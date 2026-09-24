import { Types } from 'mongoose';

export class StockOutEvent {
  constructor(
    public readonly inventoryItemId: Types.ObjectId,
    public readonly branchId: Types.ObjectId,
  ) {}
}
