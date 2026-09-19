import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PriceRange, RestaurantStatus, RestaurantType } from '../restaurant.types.js';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  legalName?: string;

  @Prop({ required: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: String, enum: RestaurantType, required: true })
  type: RestaurantType;

  @Prop({ type: String, enum: PriceRange, required: true })
  priceRange: PriceRange;

  @Prop({ lowercase: true, trim: true })
  email?: string;

  @Prop({ trim: true })
  website?: string;

  @Prop({ trim: true })
  logoUrl?: string;

  @Prop({ trim: true })
  coverImageUrl?: string;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ type: [String], default: [] })
  cuisineTypes: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  facilities: string[];

  @Prop({ default: true })
  acceptsDineIn: boolean;

  @Prop({ default: false })
  acceptsTakeaway: boolean;

  @Prop({ default: false })
  acceptsDelivery: boolean;

  @Prop({ default: true })
  acceptsReservations: boolean;

  @Prop({ default: false })
  acceptsPreOrders: boolean;

  @Prop({ type: String, enum: RestaurantStatus, default: RestaurantStatus.CLOSED })
  status: RestaurantStatus;

  @Prop({ trim: true })
  taxIdentificationNumber?: string;

  @Prop({ trim: true })
  businessRegistrationNumber?: string;

  @Prop({ trim: true })
  foodLicenseNumber?: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
RestaurantSchema.index({ tenantId: 1, deletedAt: 1 });
RestaurantSchema.index({ name: 'text', description: 'text' });