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

import { ReservationsService } from './reservations.service.js';
import { BranchesService } from '../branches/branches.service.js';

import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationDto } from './dto/update-reservation.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';
import { AssignReservationTableDto } from './dto/assign-reservation-table.dto.js';
import { CheckInReservationDto } from './dto/check-in-reservation.dto.js';
import { CancelReservationDto } from './dto/cancel-reservation.dto.js';
import { AvailabilityQueryDto } from './dto/availability-query.dto.js';
import { ReservationQueryDto } from './dto/reservation-query.dto.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly branchesService: BranchesService,
  ) {}

  @Post('branches/:branchId/reservations')
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('branchId') branchId: string,
    @Body() dto: CreateReservationDto,
  ) {
    const branch = await this.branchesService.findById(branchId);
    const userId = user?.sub || user?.id || user?._id?.toString();

    return this.reservationsService.create(
      {
        tenantId,
        restaurantId: branch.restaurantId.toString(),
        userId,
      },
      branchId,
      dto,
    );
  }

  @Get('branches/:branchId/reservations')
  findByBranch(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: ReservationQueryDto,
  ) {
    return this.reservationsService.findByBranch(
      { tenantId },
      branchId,
      query,
    );
  }

  @Get('branches/:branchId/reservations/availability')
  getAvailability(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: AvailabilityQueryDto,
  ) {
    return this.reservationsService.getAvailability(
      { tenantId },
      branchId,
      query,
    );
  }

  @Get('users/me/reservations')
  findMyReservations(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString();
    return this.reservationsService.findCustomerReservations(
      { tenantId },
      userId,
    );
  }

  @Get('reservations/:reservationId')
  findById(
    @TenantId() tenantId: string,
    @Param('reservationId') reservationId: string,
  ) {
    return this.reservationsService.findById({ tenantId }, reservationId);
  }

  @Patch('reservations/:reservationId')
  update(
    @TenantId() tenantId: string,
    @Param('reservationId') reservationId: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.reservationsService.update({ tenantId }, reservationId, dto);
  }

  @Patch('reservations/:reservationId/status')
  updateStatus(
    @TenantId() tenantId: string,
    @Param('reservationId') reservationId: string,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return this.reservationsService.updateStatus(
      { tenantId },
      reservationId,
      dto,
    );
  }

  @Patch('reservations/:reservationId/table')
  assignTable(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('reservationId') reservationId: string,
    @Body() dto: AssignReservationTableDto,
  ) {
    const userId = user?.sub || user?.id || user?._id?.toString();
    return this.reservationsService.assignTable(
      { tenantId, userId },
      reservationId,
      dto,
    );
  }

  @Post('reservations/:reservationId/confirm')
  confirm(
    @TenantId() tenantId: string,
    @Param('reservationId') reservationId: string,
  ) {
    return this.reservationsService.confirm({ tenantId }, reservationId);
  }

  @Post('reservations/:reservationId/check-in')
  checkIn(
    @TenantId() tenantId: string,
    @Param('reservationId') reservationId: string,
    @Body() dto?: CheckInReservationDto,
  ) {
    return this.reservationsService.checkIn(
      { tenantId },
      reservationId,
      dto,
    );
  }

  @Post('reservations/:reservationId/seat')
  seat(
    @TenantId() tenantId: string,
    @Param('reservationId') reservationId: string,
  ) {
    return this.reservationsService.seat({ tenantId }, reservationId);
  }

  @Post('reservations/:reservationId/complete')
  complete(
    @TenantId() tenantId: string,
    @Param('reservationId') reservationId: string,
  ) {
    return this.reservationsService.complete({ tenantId }, reservationId);
  }

  @Post('reservations/:reservationId/cancel')
  cancel(
    @TenantId() tenantId: string,
    @Param('reservationId') reservationId: string,
    @Body() dto?: CancelReservationDto,
  ) {
    return this.reservationsService.cancel({ tenantId }, reservationId, dto);
  }

  @Post('reservations/:reservationId/no-show')
  markNoShow(
    @TenantId() tenantId: string,
    @Param('reservationId') reservationId: string,
  ) {
    return this.reservationsService.markNoShow({ tenantId }, reservationId);
  }
}
