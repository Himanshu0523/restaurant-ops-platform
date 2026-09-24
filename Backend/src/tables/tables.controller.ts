import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { TablesService } from './tables.service.js';
import { BranchesService } from '../branches/branches.service.js';

import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';
import { UpdateTableStatusDto } from './dto/update-table-status.dto.js';
import { TableQueryDto } from './dto/table-query.dto.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class TablesController {
  constructor(
    private readonly tablesService: TablesService,
    private readonly branchesService: BranchesService,
  ) {}

  @Post('branches/:branchId/tables')
  async create(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Body() dto: CreateTableDto,
  ) {
    // Resolve restaurantId from the branch document
    const branch = await this.branchesService.findById(branchId);

    return this.tablesService.create(
      tenantId,
      branch.restaurantId.toString(),
      branchId,
      dto,
    );
  }

  @Get('branches/:branchId/tables')
  async findByBranch(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: TableQueryDto,
  ) {
    return this.tablesService.findByBranch(
      tenantId,
      branchId,
      query,
    );
  }

  @Get('tables/:tableId')
  async findById(
    @TenantId() tenantId: string,
    @Param('tableId') tableId: string,
  ) {
    return this.tablesService.findById(
      tenantId,
      tableId,
    );
  }

  @Patch('tables/:tableId')
  async update(
    @TenantId() tenantId: string,
    @Param('tableId') tableId: string,
    @Body() dto: UpdateTableDto,
  ) {
    return this.tablesService.update(
      tenantId,
      tableId,
      dto,
    );
  }

  @Patch('tables/:tableId/status')
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('tableId') tableId: string,
    @Body() dto: UpdateTableStatusDto,
  ) {
    return this.tablesService.updateStatus(
      tenantId,
      tableId,
      dto,
    );
  }

  @Delete('tables/:tableId')
  async remove(
    @TenantId() tenantId: string,
    @Param('tableId') tableId: string,
  ) {
    return this.tablesService.softDelete(
      tenantId,
      tableId,
    );
  }
}