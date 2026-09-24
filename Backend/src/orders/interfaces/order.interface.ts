import { Types } from 'mongoose';

export interface OrderItemResponse {
  id?: string;
  menuItemId: string;
  categoryId?: string;
  dropId?: string;

  nameSnapshot: string;
  descriptionSnapshot?: string;

  unitPrice: number;
  quantity: number;
  discountAmount: number;
  taxAmount: number;
  subtotal: number;

  variants: Record<string, unknown>[];
  addons: string[];
  specialInstructions?: string;
  preparationTimeMinutes: number;
}

export interface OrderResponse {
  id: string;
  tenantId: string;
  restaurantId: string;
  branchId: string;
  customerId?: string;
  tableId?: string;
  reservationId?: string;
  dropId?: string;

  orderNumber: string;
  type: string;
  status: string;
  fulfillmentStatus: string;
  paymentStatus: string;

  items: OrderItemResponse[];

  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;

  couponCode?: string;
  customerNote?: string;
  cancellationReason?: string;
  deliveryAddress?: Record<string, unknown>;

  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
