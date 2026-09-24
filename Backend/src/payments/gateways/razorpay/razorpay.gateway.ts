import { Injectable } from '@nestjs/common';

import {
  CreateGatewayPaymentParams,
  CreateGatewayRefundParams,
  GatewayPaymentResult,
  GatewayRefundResult,
  PaymentGatewayInterface,
} from '../../interfaces/payment-gateway.interface.js';

@Injectable()
export class RazorpayGateway
  implements PaymentGatewayInterface
{
  async createPayment(
    params: CreateGatewayPaymentParams,
  ): Promise<GatewayPaymentResult> {
    // Call Razorpay SDK/API.
    // Never expose secret credentials to frontend.

    return {
      gatewayOrderId: 'gateway-order-id',
      status: 'created',
    };
  }

  async verifyPayment(
    params: Record<string, string>,
  ): Promise<boolean> {
    // Verify Razorpay signature.
    return true;
  }

  async capturePayment(
    gatewayPaymentId: string,
    amount: number,
  ): Promise<GatewayPaymentResult> {
    return {
      gatewayPaymentId,
      status: 'captured',
    };
  }

  async refundPayment(
    params: CreateGatewayRefundParams,
  ): Promise<GatewayRefundResult> {
    return {
      gatewayRefundId: 'refund-id',
      status: 'processed',
    };
  }

  verifyWebhook(
    payload: string,
    signature: string,
  ): boolean {
    // Verify webhook signature using gateway secret.
    return true;
  }
}