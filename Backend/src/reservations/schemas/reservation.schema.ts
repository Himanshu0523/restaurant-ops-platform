import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  ReservationSource,
  ReservationStatus,
  ReservationTablePreference,
} from '../reservation.types.js';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ _id: false })
export class GuestSnapshot {
  @Prop()
  name?: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;
}

export const GuestSnapshotSchema =
  SchemaFactory.createForClass(GuestSnapshot);

@Schema({ _id: false })
export class ReservationPreferences {
  @Prop({
    type: [String],
    enum: Object.values(ReservationTablePreference),
    default: [],
  })
  preferences: ReservationTablePreference[];
}

export const ReservationPreferencesSchema =
  SchemaFactory.createForClass(ReservationPreferences);

@Schema({
  timestamps: true,
  collection: 'reservations',
})
export class Reservation {
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
    ref: 'User',
    index: true,
  })
  customerId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Table',
    index: true,
  })
  tableId?: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  reservationNumber: string;

  @Prop({
    required: true,
    min: 1,
  })
  guestCount: number;

  @Prop({
    required: true,
    type: Date,
    index: true,
  })
  startAt: Date;

  @Prop({
    required: true,
    type: Date,
  })
  endAt: Date;

  @Prop({
    required: true,
    enum: Object.values(ReservationStatus),
    default: ReservationStatus.PENDING,
    index: true,
  })
  status: ReservationStatus;

  @Prop({
    required: true,
    enum: Object.values(ReservationSource),
    default: ReservationSource.CUSTOMER_APP,
  })
  source: ReservationSource;

  @Prop({
    type: GuestSnapshotSchema,
  })
  guest?: GuestSnapshot;

  @Prop({
    type: ReservationPreferencesSchema,
  })
  preferences?: ReservationPreferences;

  @Prop()
  specialRequests?: string;

  @Prop()
  cancellationReason?: string;

  @Prop()
  checkedInAt?: Date;

  @Prop()
  seatedAt?: Date;

  @Prop()
  completedAt?: Date;

  @Prop()
  noShowAt?: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  createdBy?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  assignedBy?: Types.ObjectId;

  @Prop({
    default: 90,
  })
  durationMinutes: number;

  @Prop()
  notes?: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(Reservation);

ReservationSchema.index({
  branchId: 1,
  startAt: 1,
});

ReservationSchema.index({
  branchId: 1,
  status: 1,
  startAt: 1,
});

ReservationSchema.index({
  customerId: 1,
  startAt: -1,
});

ReservationSchema.index({
  branchId: 1,
  tableId: 1,
  startAt: 1,
});
