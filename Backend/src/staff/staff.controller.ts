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

import { StaffService } from './staff.service.js';

import {
  CreateStaffDto,
} from './dto/create-staff.dto.js';

import {
  UpdateStaffDto,
} from './dto/update-staff.dto.js';

import {
  UpdateStaffStatusDto,
} from './dto/update-staff-status.dto.js';

import {
  AssignStaffDto,
} from './dto/assign-staff.dto.js';

import {
  StaffQueryDto,
} from './dto/staff-query.dto.js';

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard.js';

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
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
  ) {}

  @Post(
    'branches/:branchId/staff',
  )
  async create(
    @TenantId()
    tenantId: string,

    @Param('branchId')
    branchId: string,

    @Body()
    dto: CreateStaffDto,
  ) {
    /*
     * restaurantId should ultimately be
     * resolved from BranchesService.
     */
    return this.staffService.create(
      tenantId,
      '',
      branchId,
      dto,
    );
  }

  @Get(
    'branches/:branchId/staff',
  )
  async findByBranch(
    @TenantId()
    tenantId: string,

    @Param('branchId')
    branchId: string,

    @Query()
    query: StaffQueryDto,
  ) {
    return this.staffService.findByBranch(
      tenantId,
      branchId,
      query,
    );
  }

  @Get(
    'staff/:staffId',
  )
  async findById(
    @TenantId()
    tenantId: string,

    @Param('staffId')
    staffId: string,
  ) {
    return this.staffService.findById(
      tenantId,
      staffId,
    );
  }

  @Patch(
    'staff/:staffId',
  )
  async update(
    @TenantId()
    tenantId: string,

    @Param('staffId')
    staffId: string,

    @Body()
    dto: UpdateStaffDto,
  ) {
    return this.staffService.update(
      tenantId,
      staffId,
      dto,
    );
  }

  @Patch(
    'staff/:staffId/status',
  )
  async updateStatus(
    @TenantId()
    tenantId: string,

    @Param('staffId')
    staffId: string,

    @Body()
    dto: UpdateStaffStatusDto,
  ) {
    return this.staffService.updateStatus(
      tenantId,
      staffId,
      dto,
    );
  }

  @Patch(
    'staff/:staffId/assign',
  )
  async assign(
    @TenantId()
    tenantId: string,

    @Param('staffId')
    staffId: string,

    @Body()
    dto: AssignStaffDto,
  ) {
    return this.staffService.assign(
      tenantId,
      staffId,
      dto,
    );
  }

  @Delete(
    'staff/:staffId',
  )
  async remove(
    @TenantId()
    tenantId: string,

    @Param('staffId')
    staffId: string,
  ) {
    return this.staffService.softDelete(
      tenantId,
      staffId,
    );
  }
}