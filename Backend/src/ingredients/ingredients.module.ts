import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  IngredientsController,
} from './ingredients.controller.js';

import {
  IngredientsService,
} from './ingredients.service.js';

import {
  Ingredient,
  IngredientSchema,
} from './schemas/ingredient.schema.js';

import {
  BranchesModule,
} from '../branches/branches.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ingredient.name,
        schema: IngredientSchema,
      },
    ]),
    BranchesModule,
  ],

  controllers: [
    IngredientsController,
  ],

  providers: [
    IngredientsService,
  ],

  exports: [
    IngredientsService,
  ],
})
export class IngredientsModule {}
