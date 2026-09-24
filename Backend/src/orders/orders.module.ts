import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Order,
  OrderSchema,
} from './schemas/order.schema.js';

import {
  MenuItem,
  MenuItemSchema,
} from '../menu/schemas/menu-item.schema.js';

import {
  Drop,
  DropSchema,
} from '../drops/schemas/drop.schema.js';

import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { BranchesModule } from '../branches/branches.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: MenuItem.name,
        schema: MenuItemSchema,
      },
      {
        name: Drop.name,
        schema: DropSchema,
      },
    ]),
    BranchesModule,
  ],

  controllers: [
    OrdersController,
  ],

  providers: [
    OrdersService,
  ],

  exports: [
    OrdersService,
  ],
})
export class OrdersModule {}
