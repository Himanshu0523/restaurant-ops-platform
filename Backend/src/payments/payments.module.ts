import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Payment,
  PaymentSchema,
} from './schemas/payment.schema.js';

import {
  PaymentTransaction,
  PaymentTransactionSchema,
} from './schemas/payment-transaction.schema.js';

import {
  PaymentRefund,
  PaymentRefundSchema,
} from './schemas/payment-refund.schema.js';

import {
  PaymentWebhook,
  PaymentWebhookSchema,
} from './schemas/payment-webhook.schema.js';

import { BranchesModule } from '../branches/branches.module.js';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';

import { PaymentGatewayFactory } from './gateways/payment-gateway.factory.js';
import { RazorpayGateway } from './gateways/razorpay/razorpay.gateway.js';
import { StripeGateway } from './gateways/stripe/stripe.gateway.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
      {
        name: PaymentTransaction.name,
        schema: PaymentTransactionSchema,
      },
      {
        name: PaymentRefund.name,
        schema: PaymentRefundSchema,
      },
      {
        name: PaymentWebhook.name,
        schema: PaymentWebhookSchema,
      },
    ]),
    BranchesModule,
  ],

  controllers: [
    PaymentsController,
  ],

  providers: [
    PaymentsService,
    PaymentGatewayFactory,
    RazorpayGateway,
    StripeGateway,
  ],

  exports: [
    PaymentsService,
  ],
})
export class PaymentsModule {}