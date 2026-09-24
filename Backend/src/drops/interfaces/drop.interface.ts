export interface DropResponse {
  id: string;

  tenantId: string;
  restaurantId: string;
  branchId: string;
  menuItemId: string;

  name: string;
  description?: string;

  type: string;
  status: string;

  totalQuantity: number;
  remainingQuantity: number;
  reservedQuantity: number;

  price: number;
  originalPrice?: number;

  availability: string[];

  startAt: Date;
  endAt: Date;

  imageUrl?: string;

  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
}
