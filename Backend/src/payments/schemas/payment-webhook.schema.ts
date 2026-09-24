import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentWebhookDocument =
  HydratedDocument<PaymentWebhook>;

@Schema({
  timestamps: true,
  collection: 'payment_webhooks',
})
export class PaymentWebhook {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  eventId: string;

  @Prop({
    required: true,
  })
  eventType: string;

  @Prop({
    required: true,
  })
  gateway: string;

  @Prop({
    required: true,
    type: Object,
  })
  payload: Record<string, unknown>;

  @Prop({
    default: false,
    index: true,
  })
  processed: boolean;

  @Prop()
  processedAt?: Date;

  @Prop()
  processingError?: string;
}

export const PaymentWebhookSchema =
  SchemaFactory.createForClass(PaymentWebhook);