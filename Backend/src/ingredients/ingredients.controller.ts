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

import {
  IngredientsService,
} from './ingredients.service.js';

import {
  BranchesService,
} from '../branches/branches.service.js';

import {
  CreateIngredientDto,
} from './dto/create-ingredient.dto.js';

import {
  UpdateIngredientDto,
} from './dto/update-ingredient.dto.js';

import {
  UpdateIngredientStatusDto,
} from './dto/update-ingredient-status.dto.js';

import {
  IngredientQueryDto,
} from './dto/ingredient-query.dto.js';

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
export class IngredientsController {
  constructor(
    private readonly ingredientsService: IngredientsService,
    private readonly branchesService: BranchesService,
  ) {}

  @Post('branches/:branchId/ingredients')
  async create(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Body() dto: CreateIngredientDto,
  ) {
    const branch = await this.branchesService.findById(branchId);

    return this.ingredientsService.create(
      tenantId,
      branch.restaurantId.toString(),
      branchId,
      dto,
    );
  }

  @Get('branches/:branchId/ingredients')
  async findByBranch(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: IngredientQueryDto,
  ) {
    return this.ingredientsService.findByBranch(
      tenantId,
      branchId,
      query,
    );
  }

  @Get('ingredients/:ingredientId')
  async findById(
    @TenantId() tenantId: string,
    @Param('ingredientId') ingredientId: string,
  ) {
    return this.ingredientsService.findById(
      tenantId,
      ingredientId,
    );
  }

  @Patch('ingredients/:ingredientId')
  async update(
    @TenantId() tenantId: string,
    @Param('ingredientId') ingredientId: string,
    @Body() dto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(
      tenantId,
      ingredientId,
      dto,
    );
  }

  @Patch('ingredients/:ingredientId/status')
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('ingredientId') ingredientId: string,
    @Body() dto: UpdateIngredientStatusDto,
  ) {
    return this.ingredientsService.updateStatus(
      tenantId,
      ingredientId,
      dto,
    );
  }

  @Delete('ingredients/:ingredientId')
  async remove(
    @TenantId() tenantId: string,
    @Param('ingredientId') ingredientId: string,
  ) {
    return this.ingredientsService.softDelete(
      tenantId,
      ingredientId,
    );
  }
}
