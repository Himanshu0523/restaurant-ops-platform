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

import { KitchenService } from './kitchen.service.js';
import { BranchesService } from '../branches/branches.service.js';

import { CreateKitchenTicketDto } from './dto/create-kitchen-ticket.dto.js';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto.js';
import { UpdateTicketPriorityDto } from './dto/update-ticket-priority.dto.js';
import { AssignTicketStationDto } from './dto/assign-ticket-station.dto.js';
import { AssignTicketStaffDto } from './dto/assign-ticket-staff.dto.js';
import { UpdateTicketItemStatusDto } from './dto/update-ticket-item-status.dto.js';
import { KitchenQueryDto } from './dto/kitchen-query.dto.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class KitchenController {
  constructor(
    private readonly kitchenService: KitchenService,
    private readonly branchesService: BranchesService,
  ) {}

  @Post('branches/:branchId/kitchen/tickets')
  async createTicket(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('branchId') branchId: string,
    @Body() dto: CreateKitchenTicketDto,
  ) {
    const branch = await this.branchesService.findById(branchId);
    const userId = user?.sub || user?.id || user?._id?.toString() || '';

    return this.kitchenService.createTicket(
      {
        tenantId,
        restaurantId: branch.restaurantId.toString(),
        userId,
      },
      branchId,
      dto,
    );
  }

  @Get('branches/:branchId/kitchen/tickets')
  findQueue(
    @TenantId() tenantId: string,
    @Param('branchId') branchId: string,
    @Query() query: KitchenQueryDto,
  ) {
    return this.kitchenService.findQueue(
      { tenantId },
      branchId,
      query,
    );
  }

  @Get('kitchen/tickets/:ticketId')
  findTicket(
    @TenantId() tenantId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.kitchenService.findTicket(
      { tenantId },
      ticketId,
    );
  }

  @Patch('kitchen/tickets/:ticketId/status')
  updateStatus(
    @TenantId() tenantId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    return this.kitchenService.updateTicketStatus(
      { tenantId },
      ticketId,
      dto,
    );
  }

  @Patch('kitchen/tickets/:ticketId/priority')
  updatePriority(
    @TenantId() tenantId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: UpdateTicketPriorityDto,
  ) {
    return this.kitchenService.updatePriority(
      { tenantId },
      ticketId,
      dto,
    );
  }

  @Patch('kitchen/tickets/:ticketId/station')
  assignStation(
    @TenantId() tenantId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: AssignTicketStationDto,
  ) {
    return this.kitchenService.assignStation(
      { tenantId },
      ticketId,
      dto,
    );
  }

  @Patch('kitchen/tickets/:ticketId/staff')
  assignStaff(
    @TenantId() tenantId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: AssignTicketStaffDto,
  ) {
    return this.kitchenService.assignStaff(
      { tenantId },
      ticketId,
      dto,
    );
  }

  @Patch('kitchen/tickets/:ticketId/items/:itemId/status')
  updateItemStatus(
    @TenantId() tenantId: string,
    @Param('ticketId') ticketId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateTicketItemStatusDto,
  ) {
    return this.kitchenService.updateItemStatus(
      { tenantId },
      ticketId,
      itemId,
      dto,
    );
  }
}
