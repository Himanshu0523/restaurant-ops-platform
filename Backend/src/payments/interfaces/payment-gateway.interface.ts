import {
  PaymentMethod,
} from '../payments.types.js';

export interface CreateGatewayPaymentParams {
  amount: number;
  currency: string;
  receipt: string;
  customerId?: string;
  method?: PaymentMethod;
  metadata?: Record<string, string>;
}

export interface GatewayPaymentResult {
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  status: string;
  raw?: Record<string, unknown>;
}

export interface CreateGatewayRefundParams {
  gatewayPaymentId: string;
  amount: number;
  reason?: string;
}

export interface GatewayRefundResult {
  gatewayRefundId: string;
  status: string;
}

export interface PaymentGatewayInterface {
  createPayment(
    params: CreateGatewayPaymentParams,
  ): Promise<GatewayPaymentResult>;

  verifyPayment(
    params: Record<string, string>,
  ): Promise<boolean>;

  capturePayment(
    gatewayPaymentId: string,
    amount: number,
  ): Promise<GatewayPaymentResult>;

  refundPayment(
    params: CreateGatewayRefundParams,
  ): Promise<GatewayRefundResult>;

  verifyWebhook(
    payload: string,
    signature: string,
  ): boolean;
}