import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MenuController } from './menu.controller.js';
import { MenuService } from './menu.service.js';
import { BranchesModule } from '../branches/branches.module.js';

import {
  Menu,
  MenuSchema,
} from './schemas/menu.schema.js';

import {
  MenuCategory,
  MenuCategorySchema,
} from './schemas/menu-category.schema.js';

import {
  MenuItem,
  MenuItemSchema,
} from './schemas/menu-item.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Menu.name,
        schema: MenuSchema,
      },
      {
        name: MenuCategory.name,
        schema: MenuCategorySchema,
      },
      {
        name: MenuItem.name,
        schema: MenuItemSchema,
      },
    ]),
    BranchesModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
