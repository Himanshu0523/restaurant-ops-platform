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

import { DropsService } from './drops.service.js';
import { BranchesService } from '../branches/branches.service.js';

import { CreateDropDto } from './dto/create-drop.dto.js';
import { UpdateDropDto } from './dto/update-drop.dto.js';
import { PublishDropDto } from './dto/publish-drop.dto.js';
import { UpdateDropStatusDto } from './dto/update-drop-status.dto.js';
import { ReserveDropStockDto } from './dto/reserve-drop-stock.dto.js';
import { DropQueryDto } from './dto/drop-query.dto.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class DropsController {
  constructor(
    private readonly dropsService: DropsService,
    private readonly branchesService: BranchesService,
  ) {}

  @Post('branches/:branchId/drops')
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('branchId') branchId: string,
    @Body() dto: CreateDropDto,
  ) {
    const branch = await this.branchesService.findById(branchId);
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.dropsService.create(
      {
        tenantId,
        restaurantId: branch.restaurantId.toString(),
        userId,
      },
      branchId,
      dto,
    );
  }

  @Get('branches/:branchId/drops')
  async findByBranch(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: DropQueryDto,
  ) {
    return this.dropsService.findByBranch(
      { tenantId },
      branchId,
      query,
    );
  }

  @Get('branches/:branchId/drops/live')
  async findLiveDrops(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
  ) {
    return this.dropsService.findLiveDrops(
      { tenantId },
      branchId,
    );
  }

  @Get('drops/:dropId')
  async findById(
    @TenantId() tenantId: string,
    @Param('dropId') dropId: string,
  ) {
    return this.dropsService.findById(
      { tenantId },
      dropId,
    );
  }

  @Patch('drops/:dropId')
  async update(
    @TenantId() tenantId: string,
    @Param('dropId') dropId: string,
    @Body() dto: UpdateDropDto,
  ) {
    return this.dropsService.update(
      { tenantId },
      dropId,
      dto,
    );
  }

  @Post('drops/:dropId/publish')
  async publish(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('dropId') dropId: string,
    @Body() dto: PublishDropDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.dropsService.publish(
      { tenantId, userId },
      dropId,
      dto,
    );
  }

  @Patch('drops/:dropId/status')
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('dropId') dropId: string,
    @Body() dto: UpdateDropStatusDto,
  ) {
    return this.dropsService.updateStatus(
      { tenantId },
      dropId,
      dto,
    );
  }

  @Post('drops/:dropId/reserve')
  async reserveStock(
    @TenantId() tenantId: string,
    @Param('dropId') dropId: string,
    @Body() dto: ReserveDropStockDto,
  ) {
    return this.dropsService.reserveStock(
      { tenantId },
      dropId,
      dto,
    );
  }

  @Post('drops/:dropId/release')
  async releaseStock(
    @TenantId() tenantId: string,
    @Param('dropId') dropId: string,
    @Body() dto: ReserveDropStockDto,
  ) {
    return this.dropsService.releaseStock(
      { tenantId },
      dropId,
      dto,
    );
  }

  @Delete('drops/:dropId')
  async remove(
    @TenantId() tenantId: string,
    @Param('dropId') dropId: string,
  ) {
    return this.dropsService.softDelete(
      { tenantId },
      dropId,
    );
  }
}
