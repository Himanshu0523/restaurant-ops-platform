import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  KitchenTicket,
  KitchenTicketSchema,
} from './schemas/kitchen-ticket.schema.js';

import {
  Order,
  OrderSchema,
} from '../orders/schemas/order.schema.js';

import { BranchesModule } from '../branches/branches.module.js';
import { KitchenController } from './kitchen.controller.js';
import { KitchenService } from './kitchen.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: KitchenTicket.name,
        schema: KitchenTicketSchema,
      },
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    BranchesModule,
  ],
  controllers: [
    KitchenController,
  ],
  providers: [
    KitchenService,
  ],
  exports: [
    KitchenService,
  ],
})
export class KitchenModule {}
