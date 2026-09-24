import { Types } from 'mongoose';

export interface InventoryItemResponse {
  id: string;
  tenantId: string;
  restaurantId: string;
  branchId: string;
  ingredientId: string;

  currentQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;

  reorderLevel: number;
  reorderQuantity: number;
  averageUnitCost: number;

  status: string;
  isActive: boolean;
}

export interface StockOperationResult {
  inventoryItemId: Types.ObjectId;
  previousQuantity: number;
  newQuantity: number;
  availableQuantity: number;
  status: string;
}
