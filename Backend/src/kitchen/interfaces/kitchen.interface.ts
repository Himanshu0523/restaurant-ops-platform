export interface KitchenTicketItemResponse {
  id?: string;
  orderItemId: string;
  menuItemId: string;
  nameSnapshot: string;
  quantity: number;
  status: string;
  station: string;
  estimatedPreparationMinutes: number;
  elapsedPreparationMinutes: number;
  specialInstructions?: string;
  startedAt?: Date;
  readyAt?: Date;
  assignedStaffId?: string;
}

export interface KitchenTicketResponse {
  id: string;
  tenantId: string;
  restaurantId: string;
  branchId: string;
  orderId: string;
  orderNumber: string;

  status: string;
  priority: string;

  items: KitchenTicketItemResponse[];

  estimatedPreparationMinutes: number;
  elapsedMinutes: number;

  queuedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  readyAt?: Date;
  completedAt?: Date;

  assignedStaffId?: string;
  customerNote?: string;
  queuePosition: number;

  createdAt: Date;
  updatedAt: Date;
}
