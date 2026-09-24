import { Injectable, NotFoundException } from '@nestjs/common';

import { PaymentGateway } from '../payments.types.js';
import { PaymentGatewayInterface } from '../interfaces/payment-gateway.interface.js';
import { RazorpayGateway } from './razorpay/razorpay.gateway.js';
import { StripeGateway } from './stripe/stripe.gateway.js';

@Injectable()
export class PaymentGatewayFactory {
  constructor(
    private readonly razorpayGateway: RazorpayGateway,
    private readonly stripeGateway: StripeGateway,
  ) {}

  getGateway(gateway: PaymentGateway): PaymentGatewayInterface {
    switch (gateway) {
      case PaymentGateway.RAZORPAY:
        return this.razorpayGateway;

      case PaymentGateway.STRIPE:
        return this.stripeGateway;

      default:
        throw new NotFoundException(
          `Unsupported payment gateway: ${gateway}`,
        );
    }
  }
}