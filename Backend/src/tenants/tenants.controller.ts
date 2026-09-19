import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import { TenantsService } from './tenants.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';

type AuthedRequest = ExpressRequest & { user: { sub: string; email: string } };

@UseGuards(AuthGuard)
@Controller('tenants')
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) {}

    @Post()
    async create(@Request() req: AuthedRequest, @Body() dto: CreateTenantDto) {
        return this.tenantsService.create(req.user.sub, dto);
    }

    @Get('me')
    async findMine(@Request() req: AuthedRequest) {
        return this.tenantsService.findMine(req.user.sub);
    }

    @Patch('me')
    async updateMine(
        @Request() req: AuthedRequest,
        @Body() dto: UpdateTenantDto,
    ) {
        return this.tenantsService.updateMine(req.user.sub, dto);
    }

    @HttpCode(HttpStatus.OK)
    @Delete('me')
    async deleteMine(@Request() req: AuthedRequest) {
        return this.tenantsService.softDeleteMine(req.user.sub);
    }
}