import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import {
  DeliveryPartnerType,
  DeliveryStatus,
} from '../delivery.types.js';

export type DeliveryDocument = HydratedDocument<Delivery>;

@Schema({ _id: false })
export class DeliveryAddress {
  @Prop({ required: true })
  line1: string;

  @Prop()
  line2?: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  state?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  landmark?: string;

  @Prop()
  recipientName?: string;

  @Prop()
  recipientPhone?: string;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;
}

export const DeliveryAddressSchema =
  SchemaFactory.createForClass(DeliveryAddress);

@Schema({ _id: false })
export class DeliveryPartnerSnapshot {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  userId?: Types.ObjectId;

  @Prop()
  name?: string;

  @Prop()
  phone?: string;

  @Prop({
    type: String,
    enum: Object.values(DeliveryPartnerType),
  })
  type: DeliveryPartnerType;
}

export const DeliveryPartnerSnapshotSchema =
  SchemaFactory.createForClass(DeliveryPartnerSnapshot);

@Schema({ _id: false })
export class DeliveryLocation {
  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  accuracy?: number;

  @Prop()
  heading?: number;

  @Prop()
  speed?: number;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const DeliveryLocationSchema =
  SchemaFactory.createForClass(DeliveryLocation);

@Schema({
  timestamps: true,
  collection: 'deliveries',
})
export class Delivery {
  @Prop({
    type: Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true,
  })
  tenantId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  })
  restaurantId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Branch',
    required: true,
    index: true,
  })
  branchId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true,
    index: true,
  })
  orderId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  deliveryNumber: string;

  @Prop({
    required: true,
    enum: Object.values(DeliveryStatus),
    default: DeliveryStatus.PENDING,
    index: true,
  })
  status: DeliveryStatus;

  @Prop({
    type: DeliveryAddressSchema,
    required: true,
  })
  address: DeliveryAddress;

  @Prop({
    type: DeliveryPartnerSnapshotSchema,
  })
  partner?: DeliveryPartnerSnapshot;

  @Prop({
    type: DeliveryLocationSchema,
  })
  currentLocation?: DeliveryLocation;

  @Prop()
  estimatedDeliveryAt?: Date;

  @Prop()
  assignedAt?: Date;

  @Prop()
  acceptedAt?: Date;

  @Prop()
  readyForPickupAt?: Date;

  @Prop()
  pickedUpAt?: Date;

  @Prop()
  outForDeliveryAt?: Date;

  @Prop()
  arrivedAt?: Date;

  @Prop()
  deliveredAt?: Date;

  @Prop()
  failedAt?: Date;

  @Prop()
  failureReason?: string;

  @Prop()
  deliveryInstructions?: string;

  @Prop()
  distanceKm?: number;

  @Prop()
  deliveryFee?: number;

  @Prop()
  notes?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  createdBy?: Types.ObjectId;
}

export const DeliverySchema =
  SchemaFactory.createForClass(Delivery);

DeliverySchema.index({
  branchId: 1,
  status: 1,
  createdAt: -1,
});

DeliverySchema.index({
  tenantId: 1,
  createdAt: -1,
});

DeliverySchema.index({
  'partner.userId': 1,
  status: 1,
});
