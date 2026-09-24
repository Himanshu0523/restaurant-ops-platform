import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Table, TableSchema } from './schemas/tables.schema.js';
import { TablesController } from './tables.controller.js';
import { TablesService } from './tables.service.js';
import { BranchesModule } from '../branches/branches.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Table.name,
        schema: TableSchema,
      },
    ]),
    BranchesModule, // provides BranchesService for restaurantId resolution
  ],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
