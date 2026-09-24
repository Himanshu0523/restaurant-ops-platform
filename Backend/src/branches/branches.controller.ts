import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  BranchesService,
} from './branches.service.js';

import {
  CreateBranchDto,
} from './dto/create-branch.dto.js';

import {
  UpdateBranchDto,
} from './dto/update-branch.dto.js';

import {
  UpdateBranchStatusDto,
} from './dto/update-branch-status.dto.js';

import {
  UpdateBranchLocationDto,
} from './dto/update-branch-location.dto.js';

import {
  UpdateBranchHoursDto,
} from './dto/update-branch-hours.dto.js';

import {
  AuthGuard as JwtAuthGuard,
} from '../auth/auth.guard.js';

import {
  TenantGuard,
} from '../common/guards/tenant/tenant.guard.js';

import {
  TenantId,
} from '../common/decorators/tenant/tenant.decorator.js';

@Controller()
@UseGuards(
  JwtAuthGuard,
  TenantGuard,
)
export class BranchesController {

  constructor(
    private readonly branchesService:
      BranchesService,
  ) {}

  @Post(
    'restaurants/:restaurantId/branches',
  )
  async create(
    @TenantId() tenantId: string,

    @Param('restaurantId')
    restaurantId: string,

    @Body()
    dto: CreateBranchDto,
  ) {

    return this.branchesService.create(
      tenantId,
      restaurantId,
      dto,
    );
  }

  @Get(
    'restaurants/:restaurantId/branches',
  )
  async findByRestaurant(
    @Param('restaurantId')
    restaurantId: string,
  ) {

    return this.branchesService
      .findByRestaurant(
        restaurantId,
      );
  }

  @Get('branches/:branchId')
  async findOne(
    @Param('branchId')
    branchId: string,
  ) {

    const branch =
      await this.branchesService
        .findById(branchId);

    return this.branchesService
      .toSafeBranch(branch);
  }

  @Patch('branches/:branchId')
  async update(
    @Param('branchId')
    branchId: string,

    @Body()
    dto: UpdateBranchDto,
  ) {

    return this.branchesService.update(
      branchId,
      dto,
    );
  }

  @Patch(
    'branches/:branchId/status',
  )
  async updateStatus(
    @Param('branchId')
    branchId: string,

    @Body()
    dto: UpdateBranchStatusDto,
  ) {

    return this.branchesService
      .updateStatus(
        branchId,
        dto,
      );
  }

  @Patch(
    'branches/:branchId/location',
  )
  async updateLocation(
    @Param('branchId')
    branchId: string,

    @Body()
    dto: UpdateBranchLocationDto,
  ) {

    return this.branchesService
      .updateLocation(
        branchId,
        dto,
      );
  }

  @Patch(
    'branches/:branchId/hours',
  )
  async updateHours(
    @Param('branchId')
    branchId: string,

    @Body()
    dto: UpdateBranchHoursDto,
  ) {

    return this.branchesService
      .updateHours(
        branchId,
        dto,
      );
  }

  @Delete(
    'branches/:branchId',
  )
  async remove(
    @Param('branchId')
    branchId: string,
  ) {

    return this.branchesService
      .softDelete(branchId);
  }
}