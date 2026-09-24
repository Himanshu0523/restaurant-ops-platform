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
  BranchStatus,
  BranchType,
} from '../branch.types.js';

import {
  BranchSettings,
  BranchSettingsSchema,
} from './branch-settings.schema.js';

export type BranchDocument =
  HydratedDocument<Branch> & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ _id: false })
export class BranchAddress {
  @Prop({ required: true, trim: true })
  addressLine1: string;

  @Prop({ trim: true })
  addressLine2?: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  postalCode: string;

  @Prop({ default: 'India' })
  country: string;
}

@Schema({ _id: false })
export class BranchLocation {
  @Prop({
    required: true,
    min: -90,
    max: 90,
  })
  latitude: number;

  @Prop({
    required: true,
    min: -180,
    max: 180,
  })
  longitude: number;
}

@Schema({ _id: false })
export class OperatingDay {
  @Prop({ required: true })
  day: string;

  @Prop({ default: true })
  isOpen: boolean;

  @Prop()
  openingTime?: string;

  @Prop()
  closingTime?: string;
}

@Schema({
  timestamps: true,
  collection: 'branches',
})
export class Branch {

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
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
  })
  slug: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(BranchType),
    default: BranchType.STANDARD,
  })
  type: BranchType;

  @Prop({
    type: String,
    enum: Object.values(BranchStatus),
    default: BranchStatus.ACTIVE,
    index: true,
  })
  status: BranchStatus;

  @Prop({
    required: true,
    type: BranchAddress,
  })
  address: BranchAddress;

  @Prop({
    required: true,
    type: BranchLocation,
  })
  location: BranchLocation;

  @Prop({
    type: [OperatingDay],
    default: [],
  })
  operatingHours: OperatingDay[];

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop()
  managerId?: Types.ObjectId;

  @Prop({
    default: 0,
    min: 0,
  })
  totalTables: number;

  @Prop({
    default: 0,
    min: 0,
  })
  totalSeats: number;

  @Prop({
    type: BranchSettingsSchema,
    default: () => ({}),
  })
  settings: BranchSettings;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date | null;
}

export const BranchSchema =
  SchemaFactory.createForClass(Branch);

BranchSchema.index({
  tenantId: 1,
  restaurantId: 1,
});

BranchSchema.index({
  restaurantId: 1,
  slug: 1,
}, {
  unique: true,
});

BranchSchema.index({
  'location.latitude': 1,
  'location.longitude': 1,
});

BranchSchema.index({
  tenantId: 1,
  status: 1,
});