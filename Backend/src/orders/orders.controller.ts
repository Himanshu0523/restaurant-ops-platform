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

import { OrdersService } from './orders.service.js';
import { BranchesService } from '../branches/branches.service.js';

import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { AddOrderItemDto } from './dto/add-order-item.dto.js';
import { UpdateOrderItemDto } from './dto/update-order-item.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { CancelOrderDto } from './dto/cancel-order.dto.js';
import { ConfirmOrderDto } from './dto/confirm-order.dto.js';
import { ApplyCouponDto } from './dto/apply-coupon.dto.js';
import { OrderQueryDto } from './dto/order-query.dto.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly branchesService: BranchesService,
  ) {}

  @Post('branches/:branchId/orders')
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('branchId') branchId: string,
    @Body() dto: CreateOrderDto,
  ) {
    const branch = await this.branchesService.findById(branchId);
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.ordersService.create(
      {
        tenantId,
        restaurantId: branch.restaurantId.toString(),
        userId,
      },
      branchId,
      dto,
    );
  }

  @Get('branches/:branchId/orders')
  async findByBranch(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: OrderQueryDto,
  ) {
    return this.ordersService.findByBranch(
      { tenantId },
      branchId,
      query,
    );
  }

  @Get('orders/:orderId')
  async findById(
    @TenantId() tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.ordersService.findById(
      { tenantId },
      orderId,
    );
  }

  @Patch('orders/:orderId')
  async update(
    @TenantId() tenantId: string,
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(
      { tenantId },
      orderId,
      dto,
    );
  }

  @Patch('orders/:orderId/status')
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      { tenantId },
      orderId,
      dto,
    );
  }

  @Post('orders/:orderId/confirm')
  async confirm(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() dto: ConfirmOrderDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.ordersService.confirm(
      { tenantId, userId },
      orderId,
      dto,
    );
  }

  @Post('orders/:orderId/cancel')
  async cancel(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() dto: CancelOrderDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.ordersService.cancel(
      { tenantId, userId },
      orderId,
      dto,
    );
  }

  @Post('orders/:orderId/items')
  async addItem(
    @TenantId() tenantId: string,
    @Param('orderId') orderId: string,
    @Body() dto: AddOrderItemDto,
  ) {
    return this.ordersService.addItem(
      { tenantId },
      orderId,
      dto,
    );
  }

  @Patch('orders/:orderId/items/:itemId')
  async updateItem(
    @TenantId() tenantId: string,
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return this.ordersService.updateItem(
      { tenantId },
      orderId,
      itemId,
      dto,
    );
  }

  @Delete('orders/:orderId/items/:itemId')
  async removeItem(
    @TenantId() tenantId: string,
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.ordersService.removeItem(
      { tenantId },
      orderId,
      itemId,
    );
  }

  @Post('orders/:orderId/coupon')
  async applyCoupon(
    @TenantId() tenantId: string,
    @Param('orderId') orderId: string,
    @Body() dto: ApplyCouponDto,
  ) {
    return this.ordersService.applyCoupon(
      { tenantId },
      orderId,
      dto,
    );
  }
}
