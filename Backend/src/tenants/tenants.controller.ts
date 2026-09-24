import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TenantsService } from './tenants.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { UpdateTenantSettingsDto } from './dto/update-tenant-settings.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('tenants')
@UseGuards(AuthGuard)
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
  ) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateTenantDto,
  ) {
    return this.tenantsService.create(userId, dto);
  }

  @Get('mine')
  async findMine(
    @CurrentUser('sub') userId: string,
  ) {
    return this.tenantsService.findByOwner(userId);
  }

  @Get(':tenantId')
  async findOne(
    @Param('tenantId') tenantId: string,
  ) {
    const tenant = await this.tenantsService.findById(tenantId);
    return this.tenantsService.toSafeTenant(tenant);
  }

  @Patch(':tenantId')
  async update(
    @Param('tenantId') tenantId: string,
    @Body() dto: UpdateTenantDto,
  ) {
    return this.tenantsService.update(tenantId, dto);
  }

  @Patch(':tenantId/settings')
  async updateSettings(
    @Param('tenantId') tenantId: string,
    @Body() dto: UpdateTenantSettingsDto,
  ) {
    return this.tenantsService.updateSettings(tenantId, dto);
  }
}