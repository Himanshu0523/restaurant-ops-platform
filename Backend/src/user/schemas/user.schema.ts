import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  Allergen,
  DietaryPreference,
  UserRole,
  UserStatus,
} from '../user.types.js';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class UserPreferences {
  @Prop({
    type: [String],
    enum: Object.values(DietaryPreference),
    default: [],
  })
  dietaryPreferences: DietaryPreference[];

  @Prop({
    type: [String],
    enum: Object.values(Allergen),
    default: [],
  })
  excludedAllergens: Allergen[];
}

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  fname: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  lname: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    default: null,
    trim: true,
  })
  phone: string | null;

  @Prop({
    type: Boolean,
    default: false,
  })
  phoneVerified: boolean;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER,
    index: true,
  })
  role: UserRole;

  @Prop({
    type: Types.ObjectId,
    ref: 'Tenant',
    default: null,
    index: true,
  })
  tenantId: Types.ObjectId | null;

  @Prop({
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE,
    index: true,
  })
  status: UserStatus;

  @Prop({
    type: String,
    default: null,
  })
  refreshTokenHash: string | null;

  @Prop({
    type: String,
    default: null,
  })
  refreshToken: string | null;

  @Prop({
    type: String,
    default: null,
  })
  resetPasswordTokenHash: string | null;

  @Prop({
    type: String,
    default: null,
  })
  resetPasswordToken: string | null;

  @Prop({
    type: Date,
    default: null,
  })
  resetPasswordExpires: Date | null;

  @Prop({
    type: Boolean,
    default: false,
  })
  emailVerified: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  lastLoginAt: Date | null;

  @Prop({
    type: UserPreferences,
    default: () => ({
      dietaryPreferences: [],
      excludedAllergens: [],
    }),
  })
  preferences: UserPreferences;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  tenantId: 1,
  role: 1,
  status: 1,
});

UserSchema.index({
  tenantId: 1,
  email: 1,
});
