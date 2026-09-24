import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';

import { MenuService } from './menu.service.js';
import { BranchesService } from '../branches/branches.service.js';

import { CreateMenuDto } from './dto/create-menu.dto.js';
import { UpdateMenuDto } from './dto/update-menu.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateMenuItemDto } from './dto/create-menu-item.dto.js';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto.js';
import { UpdateMenuItemStatusDto } from './dto/update-menu-item-status.dto.js';
import { MenuQueryDto } from './dto/menu-query.dto.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly branchesService: BranchesService,
  ) {}

  // MENUS

  @Post('branches/:branchId/menus')
  async createMenu(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Body() dto: CreateMenuDto,
  ) {
    const branch = await this.branchesService.findById(branchId);

    return this.menuService.createMenu(
      tenantId,
      branch.restaurantId.toString(),
      branchId,
      dto,
    );
  }

  @Get('branches/:branchId/menus')
  async findMenus(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
  ) {
    return this.menuService.findMenus(tenantId, branchId);
  }

  @Patch('menus/:menuId')
  async updateMenu(
    @TenantId() tenantId: string,
    @Param('menuId') menuId: string,
    @Body() dto: UpdateMenuDto,
  ) {
    return this.menuService.updateMenu(tenantId, menuId, dto);
  }

  @Patch('menus/:menuId/publish')
  async publishMenu(
    @TenantId() tenantId: string,
    @Param('menuId') menuId: string,
  ) {
    return this.menuService.publishMenu(tenantId, menuId);
  }

  // CATEGORIES

  @Post('menus/:menuId/categories')
  async createCategory(
    @TenantId() tenantId: string,
    @Param('menuId') menuId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.menuService.createCategory(tenantId, menuId, dto);
  }

  @Get('menus/:menuId/categories')
  async findCategories(
    @TenantId() tenantId: string,
    @Param('menuId') menuId: string,
  ) {
    return this.menuService.findCategories(tenantId, menuId);
  }

  @Patch('categories/:categoryId')
  async updateCategory(
    @TenantId() tenantId: string,
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.menuService.updateCategory(tenantId, categoryId, dto);
  }

  // ITEMS

  @Post('menus/:menuId/items')
  async createItem(
    @TenantId() tenantId: string,
    @Param('menuId') menuId: string,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.menuService.createItem(tenantId, menuId, dto);
  }

  @Get('menus/:menuId/items')
  async findItems(
    @TenantId() tenantId: string,
    @Param('menuId') menuId: string,
    @Query() query: MenuQueryDto,
  ) {
    return this.menuService.findItems(tenantId, menuId, query);
  }

  @Patch('menu-items/:itemId')
  async updateItem(
    @TenantId() tenantId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateItem(tenantId, itemId, dto);
  }

  @Patch('menu-items/:itemId/status')
  async updateItemStatus(
    @TenantId() tenantId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateMenuItemStatusDto,
  ) {
    return this.menuService.updateItemStatus(tenantId, itemId, dto);
  }

  @Delete('menu-items/:itemId')
  async deleteItem(
    @TenantId() tenantId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.menuService.deleteItem(tenantId, itemId);
  }
}
