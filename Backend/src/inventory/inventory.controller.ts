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

import { InventoryService } from './inventory.service.js';
import { BranchesService } from '../branches/branches.service.js';

import { CreateInventoryItemDto } from './dto/create-inventory-item.dto.js';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto.js';
import { ReceiveStockDto } from './dto/receive-stock.dto.js';
import { AdjustStockDto } from './dto/adjust-stock.dto.js';
import { RecordWasteDto } from './dto/record-waste.dto.js';
import { TransferStockDto } from './dto/transfer-stock.dto.js';
import { UpdateInventoryStatusDto } from './dto/update-inventory-status.dto.js';
import { InventoryQueryDto } from './dto/inventory-query.dto.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly branchesService: BranchesService,
  ) {}

  @Post('branches/:branchId/inventory/items')
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('branchId') branchId: string,
    @Body() dto: CreateInventoryItemDto,
  ) {
    const branch = await this.branchesService.findById(branchId);
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.inventoryService.create(
      {
        tenantId,
        restaurantId: branch.restaurantId.toString(),
        userId,
      },
      branchId,
      dto,
    );
  }

  @Get('branches/:branchId/inventory/items')
  async findByBranch(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: InventoryQueryDto,
  ) {
    return this.inventoryService.findByBranch(
      { tenantId },
      branchId,
      query,
    );
  }

  @Get('inventory/items/:inventoryItemId')
  async findById(
    @TenantId() tenantId: string,
    @Param('inventoryItemId') inventoryItemId: string,
  ) {
    return this.inventoryService.findById(
      { tenantId },
      inventoryItemId,
    );
  }

  @Patch('inventory/items/:inventoryItemId')
  async update(
    @TenantId() tenantId: string,
    @Param('inventoryItemId') inventoryItemId: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(
      { tenantId },
      inventoryItemId,
      dto,
    );
  }

  @Post('inventory/items/:inventoryItemId/receive')
  async receiveStock(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('inventoryItemId') inventoryItemId: string,
    @Body() dto: ReceiveStockDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.inventoryService.receiveStock(
      { tenantId, userId },
      inventoryItemId,
      dto,
    );
  }

  @Post('inventory/items/:inventoryItemId/adjust')
  async adjustStock(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('inventoryItemId') inventoryItemId: string,
    @Body() dto: AdjustStockDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.inventoryService.adjustStock(
      { tenantId, userId },
      inventoryItemId,
      dto,
    );
  }

  @Post('inventory/items/:inventoryItemId/waste')
  async recordWaste(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('inventoryItemId') inventoryItemId: string,
    @Body() dto: RecordWasteDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.inventoryService.recordWaste(
      { tenantId, userId },
      inventoryItemId,
      dto,
    );
  }

  @Get('inventory/items/:inventoryItemId/movements')
  async getMovements(
    @TenantId() tenantId: string,
    @Param('inventoryItemId') inventoryItemId: string,
  ) {
    return this.inventoryService.getMovements(
      { tenantId },
      inventoryItemId,
    );
  }

  @Post('branches/:branchId/inventory/transfers')
  async transferStock(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('branchId') branchId: string,
    @Body() dto: TransferStockDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.inventoryService.transferStock(
      { tenantId, userId },
      branchId,
      dto,
    );
  }

  @Patch('inventory/items/:inventoryItemId/status')
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('inventoryItemId') inventoryItemId: string,
    @Body() dto: UpdateInventoryStatusDto,
  ) {
    return this.inventoryService.updateStatus(
      { tenantId },
      inventoryItemId,
      dto,
    );
  }

  @Delete('inventory/items/:inventoryItemId')
  async remove(
    @TenantId() tenantId: string,
    @Param('inventoryItemId') inventoryItemId: string,
  ) {
    return this.inventoryService.softDelete(
      { tenantId },
      inventoryItemId,
    );
  }
}
