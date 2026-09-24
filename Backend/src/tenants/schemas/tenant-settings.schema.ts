import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class TenantSettings {
  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ default: 'Asia/Kolkata' })
  timezone: string;

  @Prop({ default: 'en-IN' })
  locale: string;

  @Prop({ default: true })
  enableNotifications: boolean;

  @Prop({ default: true })
  enableAI: boolean;

  @Prop({ default: true })
  enableAnalytics: boolean;

  @Prop({ default: true })
  enableInventory: boolean;

  @Prop({ default: true })
  enableReservations: boolean;

  @Prop({ default: true })
  enableDelivery: boolean;

  @Prop({ default: true })
  enableCustomerReviews: boolean;
}

export const TenantSettingsSchema =
  SchemaFactory.createForClass(TenantSettings);