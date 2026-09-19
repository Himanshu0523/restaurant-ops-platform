import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TenantPlan, TenantStatus } from '../tenant.types.js';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema({ timestamps: true })
export class Tenant {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    slug: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    ownerId: Types.ObjectId;

    @Prop({ type: String, enum: TenantPlan, default: TenantPlan.FREE })
    plan: TenantPlan;

    @Prop({ type: String, enum: TenantStatus, default: TenantStatus.TRIAL })
    status: TenantStatus;

    @Prop({ type: Date, default: null })
    deletedAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);