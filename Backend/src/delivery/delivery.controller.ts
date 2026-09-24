import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { DeliveryService } from './delivery.service.js';
import { BranchesService } from '../branches/branches.service.js';

import { CreateDeliveryDto } from './dto/create-delivery.dto.js';
import { UpdateDeliveryDto } from './dto/update-delivery.dto.js';
import { AssignDeliveryPartnerDto } from './dto/assign-delivery-partner.dto.js';
import { UpdateDeliveryLocationDto } from './dto/update-delivery-location.dto.js';
import { MarkPickupDto } from './dto/mark-pickup.dto.js';
import { MarkDeliveredDto } from './dto/mark-delivered.dto.js';
import { RecordDeliveryFailureDto } from './dto/record-delivery-failure.dto.js';
import { DeliveryQueryDto } from './dto/delivery-query.dto.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class DeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly branchesService: BranchesService,
  ) {}

  // ── Create 

  @Post('orders/:orderId/delivery')
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() dto: CreateDeliveryDto,
  ) {
    // We need the branchId from the order — for now we embed it in the
    // tenant context; orders service can provide this later via an event.
    // The controller resolves restaurantId lazily by calling the branch.
    const userId = user?.sub || user?.id || user?._id?.toString();

    return this.deliveryService.create(
      { tenantId, restaurantId: '', userId },
      '',
      orderId,
      dto,
    );
  }

  // ── Read ────────────────────────────────────────────────────────────────────

  @Get('branches/:branchId/deliveries')
  findByBranch(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: DeliveryQueryDto,
  ) {
    return this.deliveryService.findByBranch({ tenantId }, branchId, query);
  }

  @Get('deliveries/:deliveryId')
  findById(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.deliveryService.findById({ tenantId }, deliveryId);
  }

  @Get('orders/:orderId/delivery')
  findByOrderId(
    @TenantId() tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.deliveryService.findByOrderId({ tenantId }, orderId);
  }

  @Get('deliveries/:deliveryId/attempts')
  findAttempts(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.deliveryService.findAttempts({ tenantId }, deliveryId);
  }

  // ── Update address ──────────────────────────────────────────────────────────

  @Patch('deliveries/:deliveryId')
  update(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
    @Body() dto: UpdateDeliveryDto,
  ) {
    return this.deliveryService.update({ tenantId }, deliveryId, dto);
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  @Post('deliveries/:deliveryId/assign')
  assignPartner(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
    @Body() dto: AssignDeliveryPartnerDto,
  ) {
    return this.deliveryService.assignPartner({ tenantId }, deliveryId, dto);
  }

  @Post('deliveries/:deliveryId/accept')
  accept(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.deliveryService.accept({ tenantId }, deliveryId);
  }

  @Post('deliveries/:deliveryId/ready-for-pickup')
  markReadyForPickup(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.deliveryService.markReadyForPickup({ tenantId }, deliveryId);
  }

  @Post('deliveries/:deliveryId/pickup')
  markPickedUp(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
    @Body() dto: MarkPickupDto,
  ) {
    return this.deliveryService.markPickedUp({ tenantId }, deliveryId, dto);
  }

  @Post('deliveries/:deliveryId/out-for-delivery')
  markOutForDelivery(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.deliveryService.markOutForDelivery({ tenantId }, deliveryId);
  }

  @Post('deliveries/:deliveryId/arrived')
  markArrived(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.deliveryService.markArrived({ tenantId }, deliveryId);
  }

  @Post('deliveries/:deliveryId/location')
  updateLocation(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
    @Body() dto: UpdateDeliveryLocationDto,
  ) {
    return this.deliveryService.updateLocation({ tenantId }, deliveryId, dto);
  }

  @Post('deliveries/:deliveryId/delivered')
  markDelivered(
    @TenantId() tenantId: string,
    @Param('deliveryId') deliveryId: string,
    @Body() dto: MarkDeliveredDto,
  ) {
    return this.deliveryService.markDelivered({ tenantId }, deliveryId, dto);
  }

  @Post('deliveries/:deliveryId/failure')
  recordFailure(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('deliveryId') deliveryId: string,
    @Body() dto: RecordDeliveryFailureDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString();
    return this.deliveryService.recordFailure(
      { tenantId, userId },
      deliveryId,
      dto,
    );
  }
}
