import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

import {
  TenantPlan,
  TenantStatus,
} from '../tenant.types.js';

import {
  TenantSettings,
  TenantSettingsSchema,
} from './tenant-settings.schema.js';

export type TenantDocument =
  HydratedDocument<Tenant>;

@Schema({
  timestamps: true,
  collection: 'tenants',
})
export class Tenant {

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  slug: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(TenantStatus),
    default: TenantStatus.PENDING,
    index: true,
  })
  status: TenantStatus;

  @Prop({
    type: String,
    enum: Object.values(TenantPlan),
    default: TenantPlan.FREE,
    index: true,
  })
  plan: TenantPlan;

  /**
   * User who owns the tenant.
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  ownerId: Types.ObjectId;

  @Prop({
    type: String,
    trim: true,
  })
  email?: string;

  @Prop({
    type: String,
    trim: true,
  })
  phone?: string;

  @Prop({
    type: TenantSettingsSchema,
    default: () => ({}),
  })
  settings: TenantSettings;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date | null;
}

export const TenantSchema =
  SchemaFactory.createForClass(Tenant);

TenantSchema.index({
  ownerId: 1,
  status: 1,
});

TenantSchema.index({
  slug: 1,
  status: 1,
});