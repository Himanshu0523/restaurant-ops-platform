import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  InventoryItem,
  InventoryItemSchema,
} from './schemas/inventory-item.schema.js';

import {
  InventoryLot,
  InventoryLotSchema,
} from './schemas/inventory-lot.schema.js';

import {
  InventoryMovement,
  InventoryMovementSchema,
} from './schemas/inventory-movement.schema.js';

import {
  Ingredient,
  IngredientSchema,
} from '../ingredients/schemas/ingredient.schema.js';

import { InventoryController } from './inventory.controller.js';
import { InventoryService } from './inventory.service.js';
import { BranchesModule } from '../branches/branches.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InventoryItem.name,
        schema: InventoryItemSchema,
      },
      {
        name: InventoryLot.name,
        schema: InventoryLotSchema,
      },
      {
        name: InventoryMovement.name,
        schema: InventoryMovementSchema,
      },
      {
        name: Ingredient.name,
        schema: IngredientSchema,
      },
    ]),
    BranchesModule,
  ],

  controllers: [InventoryController],

  providers: [InventoryService],

  exports: [InventoryService],
})
export class InventoryModule {}
