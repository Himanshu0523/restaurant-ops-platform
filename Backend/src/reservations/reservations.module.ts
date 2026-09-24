import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Reservation,
  ReservationSchema,
} from './schemas/reservation.schema.js';
import {
  ReservationSlot,
  ReservationSlotSchema,
} from './schemas/reservation-slot.schema.js';
import { Table, TableSchema } from '../tables/schemas/tables.schema.js';

import { BranchesModule } from '../branches/branches.module.js';
import { ReservationsController } from './reservations.controller.js';
import { ReservationsService } from './reservations.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
      {
        name: ReservationSlot.name,
        schema: ReservationSlotSchema,
      },
      {
        name: Table.name,
        schema: TableSchema,
      },
    ]),
    BranchesModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
