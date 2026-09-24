import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class BranchSettings {
  @Prop({ default: true })
  acceptingOrders: boolean;

  @Prop({ default: true })
  acceptingReservations: boolean;

  @Prop({ default: true })
  acceptingDineIn: boolean;

  @Prop({ default: true })
  acceptingTakeaway: boolean;

  @Prop({ default: true })
  acceptingDelivery: boolean;

  @Prop({ default: true })
  autoAcceptOrders: boolean;

  @Prop({ default: 20 })
  defaultPreparationTimeMinutes: number;

  @Prop({ default: 60 })
  maxPreparationTimeMinutes: number;

  @Prop({ default: true })
  enableKitchen: boolean;

  @Prop({ default: true })
  enableInventory: boolean;

  @Prop({ default: true })
  enableReservations: boolean;

  @Prop({ default: true })
  enableDelivery: boolean;

  @Prop({ default: true })
  enableAI: boolean;

  @Prop({ default: true })
  enableNotifications: boolean;
}

export const BranchSettingsSchema =
  SchemaFactory.createForClass(BranchSettings);