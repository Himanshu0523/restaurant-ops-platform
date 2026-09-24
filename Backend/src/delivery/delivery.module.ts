import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Delivery,
  DeliverySchema,
} from './schemas/delivery.schema.js';
import {
  DeliveryAttempt,
  DeliveryAttemptSchema,
} from './schemas/delivery-attempt.schema.js';

import { BranchesModule } from '../branches/branches.module.js';
import { DeliveryController } from './delivery.controller.js';
import { DeliveryService } from './delivery.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Delivery.name,
        schema: DeliverySchema,
      },
      {
        name: DeliveryAttempt.name,
        schema: DeliveryAttemptSchema,
      },
    ]),
    BranchesModule,
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
