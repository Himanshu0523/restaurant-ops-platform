import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Drop,
  DropSchema,
} from './schemas/drop.schema.js';

import {
  MenuItem,
  MenuItemSchema,
} from '../menu/schemas/menu-item.schema.js';

import { DropsController } from './drops.controller.js';
import { DropsService } from './drops.service.js';
import { BranchesModule } from '../branches/branches.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Drop.name,
        schema: DropSchema,
      },
      {
        name: MenuItem.name,
        schema: MenuItemSchema,
      },
    ]),
    BranchesModule,
  ],

  controllers: [
    DropsController,
  ],

  providers: [
    DropsService,
  ],

  exports: [
    DropsService,
  ],
})
export class DropsModule {}
