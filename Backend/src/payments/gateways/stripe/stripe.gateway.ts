import { Injectable } from '@nestjs/common';

import {
  CreateGatewayPaymentParams,
  CreateGatewayRefundParams,
  GatewayPaymentResult,
  GatewayRefundResult,
  PaymentGatewayInterface,
} from '../../interfaces/payment-gateway.interface.js';

@Injectable()
export class StripeGateway implements PaymentGatewayInterface {
  async createPayment(
    params: CreateGatewayPaymentParams,
  ): Promise<GatewayPaymentResult> {
    // Create a Stripe PaymentIntent.
    // Use Stripe SDK: stripe.paymentIntents.create(...)
    return {
      gatewayPaymentId: 'pi_stub_payment_intent',
      status: 'requires_payment_method',
    };
  }

  async verifyPayment(
    params: Record<string, string>,
  ): Promise<boolean> {
    // Verify payment intent status via Stripe API.
    return true;
  }

  async capturePayment(
    gatewayPaymentId: string,
    amount: number,
  ): Promise<GatewayPaymentResult> {
    // stripe.paymentIntents.capture(gatewayPaymentId)
    return {
      gatewayPaymentId,
      status: 'succeeded',
    };
  }

  async refundPayment(
    params: CreateGatewayRefundParams,
  ): Promise<GatewayRefundResult> {
    // stripe.refunds.create({ payment_intent: ..., amount: ... })
    return {
      gatewayRefundId: 're_stub_refund',
      status: 'succeeded',
    };
  }

  verifyWebhook(payload: string, signature: string): boolean {
    // stripe.webhooks.constructEvent(payload, signature, endpointSecret)
    return true;
  }
}
