import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReservationSlotDocument =
  HydratedDocument<ReservationSlot>;

@Schema({
  timestamps: true,
  collection: 'reservation_slots',
})
export class ReservationSlot {
  @Prop({
    type: Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true,
  })
  tenantId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Branch',
    required: true,
    index: true,
  })
  branchId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Table',
    required: true,
    index: true,
  })
  tableId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Reservation',
    required: true,
    index: true,
  })
  reservationId: Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
  })
  slotStart: Date;

  @Prop({
    type: Date,
    required: true,
  })
  slotEnd: Date;
}

export const ReservationSlotSchema =
  SchemaFactory.createForClass(ReservationSlot);

ReservationSlotSchema.index(
  {
    branchId: 1,
    tableId: 1,
    slotStart: 1,
  },
  {
    unique: true,
    name: 'unique_table_reservation_slot',
  },
);

