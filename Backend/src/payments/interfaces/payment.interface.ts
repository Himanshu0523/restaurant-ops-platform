import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from '../payments.types.js';

export interface PaymentResponse {
  id: string;
  tenantId: string;
  restaurantId: string;
  branchId: string;
  orderId: string;
  customerId?: string;
  paymentNumber: string;
  amount: number;
  refundedAmount: number;
  currency: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  gateway: PaymentGateway;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  idempotencyKey: string;
  failureCode?: string;
  failureMessage?: string;
  paidAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentTransactionResponse {
  id: string;
  paymentId: string;
  type: string;
  status: string;
  amount: number;
  gatewayTransactionId?: string;
  failureCode?: string;
  failureMessage?: string;
  processedAt?: Date;
  createdAt: Date;
}

export interface PaymentRefundResponse {
  id: string;
  paymentId: string;
  amount: number;
  status: RefundStatus;
  refundNumber?: string;
  gatewayRefundId?: string;
  reason?: string;
  failureMessage?: string;
  initiatedBy?: string;
  completedAt?: Date;
  createdAt: Date;
}

export interface GatewayCheckoutData {
  paymentId: string;
  paymentNumber: string;
  gateway: PaymentGateway;
  gatewayOrderId?: string;
  amount: number;
  currency: string;
}
