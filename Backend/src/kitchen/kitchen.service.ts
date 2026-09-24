import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  KitchenTicket,
  KitchenTicketDocument,
} from './schemas/kitchen-ticket.schema.js';

import {
  Order,
  OrderDocument,
} from '../orders/schemas/order.schema.js';

import { CreateKitchenTicketDto } from './dto/create-kitchen-ticket.dto.js';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto.js';
import { UpdateTicketPriorityDto } from './dto/update-ticket-priority.dto.js';
import { AssignTicketStationDto } from './dto/assign-ticket-station.dto.js';
import { AssignTicketStaffDto } from './dto/assign-ticket-staff.dto.js';
import { UpdateTicketItemStatusDto } from './dto/update-ticket-item-status.dto.js';
import { KitchenQueryDto } from './dto/kitchen-query.dto.js';

import {
  KitchenPriority,
  KitchenStationType,
  KitchenTicketItemStatus,
  KitchenTicketStatus,
} from './kitchen.types.js';

import { KitchenTicketResponse } from './interfaces/kitchen.interface.js';
import { KITCHEN_DEFAULTS } from './constants/kitchen.constants.js';

@Injectable()
export class KitchenService {
  constructor(
    @InjectModel(KitchenTicket.name)
    private readonly ticketModel: Model<KitchenTicketDocument>,

    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createTicket(
    context: { tenantId: string; restaurantId: string; userId: string },
    branchId: string,
    dto: CreateKitchenTicketDto,
  ): Promise<KitchenTicketResponse> {
    const order = await this.orderModel.findOne({
      _id: dto.orderId,
      tenantId: context.tenantId,
      branchId,
    });

    if (!order) {
      throw new NotFoundException('Order not found for this branch');
    }

    const existingTicket = await this.ticketModel.findOne({
      orderId: dto.orderId,
      tenantId: context.tenantId,
    });

    if (existingTicket) {
      throw new ConflictException('Kitchen ticket already exists for this order');
    }

    const items = (order.items || []).map((orderItem) => {
      const prepMinutes =
        orderItem.preparationTimeMinutes ||
        KITCHEN_DEFAULTS.DEFAULT_PREPARATION_TIME_MINUTES;

      return {
        orderItemId: (orderItem as any)._id,
        menuItemId: orderItem.menuItemId,
        nameSnapshot: orderItem.nameSnapshot,
        quantity: orderItem.quantity,
        status: KitchenTicketItemStatus.PENDING,
        station: this.resolveDefaultStation(orderItem.nameSnapshot),
        estimatedPreparationMinutes: prepMinutes,
        elapsedPreparationMinutes: 0,
        specialInstructions: orderItem.specialInstructions,
      };
    });

    const estimatedMinutes = this.calculateTicketEta(items);
    const queuedAt = new Date();

    const ticket = await this.ticketModel.create({
      tenantId: new Types.ObjectId(context.tenantId),
      restaurantId: new Types.ObjectId(context.restaurantId),
      branchId: new Types.ObjectId(branchId),
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: KitchenTicketStatus.QUEUED,
      priority: KitchenPriority.NORMAL,
      items,
      estimatedPreparationMinutes: estimatedMinutes,
      queuedAt,
      customerNote: dto.customerNote || order.customerNote,
      queuePosition: await this.getNextQueuePosition(context.tenantId, branchId),
    });

    return this.toSafeTicket(ticket);
  }

  async findTicket(
    context: { tenantId: string },
    ticketId: string,
  ): Promise<KitchenTicketResponse> {
    const ticket = await this.ticketModel
      .findOne({
        _id: ticketId,
        tenantId: context.tenantId,
      })
      .lean();

    if (!ticket) {
      throw new NotFoundException('Kitchen ticket not found');
    }

    return this.toSafeTicket(ticket);
  }

  async findQueue(
    context: { tenantId: string },
    branchId: string,
    query: KitchenQueryDto,
  ) {
    const {
      page = 1,
      limit = 20,
      ...filters
    } = query;

    const filter: Record<string, any> = {
      tenantId: context.tenantId,
      branchId,
    };

    if (filters.status) {
      filter.status = filters.status;
    } else {
      // Default to active tickets (not COMPLETED or CANCELLED)
      filter.status = {
        $in: [
          KitchenTicketStatus.QUEUED,
          KitchenTicketStatus.ACCEPTED,
          KitchenTicketStatus.PREPARING,
          KitchenTicketStatus.PARTIALLY_READY,
          KitchenTicketStatus.READY,
        ],
      };
    }

    if (filters.priority) {
      filter.priority = filters.priority;
    }

    if (filters.station) {
      filter['items.station'] = filters.station;
    }

    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      this.ticketModel
        .find(filter)
        .sort({ priority: -1, queuedAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.ticketModel.countDocuments(filter),
    ]);

    return {
      data: tickets.map((ticket) => this.toSafeTicket(ticket)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateTicketStatus(
    context: { tenantId: string },
    ticketId: string,
    dto: UpdateTicketStatusDto,
  ): Promise<KitchenTicketResponse> {
    const ticket = await this.ticketModel.findOne({
      _id: ticketId,
      tenantId: context.tenantId,
    });

    if (!ticket) {
      throw new NotFoundException('Kitchen ticket not found');
    }

    ticket.status = dto.status;
    const now = new Date();

    if (dto.status === KitchenTicketStatus.ACCEPTED && !ticket.acceptedAt) {
      ticket.acceptedAt = now;
    } else if (dto.status === KitchenTicketStatus.PREPARING) {
      if (!ticket.startedAt) ticket.startedAt = now;
      ticket.items.forEach((item) => {
        if (item.status === KitchenTicketItemStatus.PENDING) {
          item.status = KitchenTicketItemStatus.PREPARING;
          item.startedAt = now;
        }
      });
    } else if (dto.status === KitchenTicketStatus.READY) {
      ticket.readyAt = now;
      ticket.items.forEach((item) => {
        if (item.status !== KitchenTicketItemStatus.CANCELLED) {
          item.status = KitchenTicketItemStatus.READY;
          item.readyAt = now;
        }
      });
    } else if (dto.status === KitchenTicketStatus.COMPLETED) {
      ticket.completedAt = now;
    } else if (dto.status === KitchenTicketStatus.CANCELLED) {
      ticket.items.forEach((item) => {
        item.status = KitchenTicketItemStatus.CANCELLED;
      });
    }

    await ticket.save();
    return this.toSafeTicket(ticket);
  }

  async updatePriority(
    context: { tenantId: string },
    ticketId: string,
    dto: UpdateTicketPriorityDto,
  ): Promise<KitchenTicketResponse> {
    const ticket = await this.ticketModel.findOne({
      _id: ticketId,
      tenantId: context.tenantId,
    });

    if (!ticket) {
      throw new NotFoundException('Kitchen ticket not found');
    }

    ticket.priority = dto.priority;
    await ticket.save();

    return this.toSafeTicket(ticket);
  }

  async assignStation(
    context: { tenantId: string },
    ticketId: string,
    dto: AssignTicketStationDto,
  ): Promise<KitchenTicketResponse> {
    const ticket = await this.ticketModel.findOne({
      _id: ticketId,
      tenantId: context.tenantId,
    });

    if (!ticket) {
      throw new NotFoundException('Kitchen ticket not found');
    }

    const item = (ticket.items as any).id(dto.itemId);
    if (!item) {
      throw new NotFoundException('Ticket item not found');
    }

    item.station = dto.station;
    ticket.estimatedPreparationMinutes = this.calculateTicketEta(ticket.items);

    await ticket.save();
    return this.toSafeTicket(ticket);
  }

  async assignStaff(
    context: { tenantId: string },
    ticketId: string,
    dto: AssignTicketStaffDto,
  ): Promise<KitchenTicketResponse> {
    const ticket = await this.ticketModel.findOne({
      _id: ticketId,
      tenantId: context.tenantId,
    });

    if (!ticket) {
      throw new NotFoundException('Kitchen ticket not found');
    }

    ticket.assignedStaffId = new Types.ObjectId(dto.staffId);
    await ticket.save();

    return this.toSafeTicket(ticket);
  }

  async updateItemStatus(
    context: { tenantId: string },
    ticketId: string,
    itemId: string,
    dto: UpdateTicketItemStatusDto,
  ): Promise<KitchenTicketResponse> {
    const ticket = await this.ticketModel.findOne({
      _id: ticketId,
      tenantId: context.tenantId,
    });

    if (!ticket) {
      throw new NotFoundException('Kitchen ticket not found');
    }

    const item = (ticket.items as any).id(itemId);
    if (!item) {
      throw new NotFoundException('Ticket item not found');
    }

    item.status = dto.status;
    const now = new Date();

    if (dto.status === KitchenTicketItemStatus.PREPARING && !item.startedAt) {
      item.startedAt = now;
      if (!ticket.startedAt) ticket.startedAt = now;
    } else if (dto.status === KitchenTicketItemStatus.READY) {
      item.readyAt = now;
    }

    // Recalculate ticket level status
    const activeItems = ticket.items.filter(
      (it) => it.status !== KitchenTicketItemStatus.CANCELLED,
    );

    const allReady =
      activeItems.length > 0 &&
      activeItems.every((it) => it.status === KitchenTicketItemStatus.READY);

    const someReadyOrPrep = activeItems.some(
      (it) =>
        it.status === KitchenTicketItemStatus.READY ||
        it.status === KitchenTicketItemStatus.PREPARING,
    );

    if (allReady) {
      ticket.status = KitchenTicketStatus.READY;
      if (!ticket.readyAt) ticket.readyAt = now;
    } else if (someReadyOrPrep) {
      ticket.status = KitchenTicketStatus.PARTIALLY_READY;
    }

    await ticket.save();
    return this.toSafeTicket(ticket);
  }

  private calculateTicketEta(items: any[]): number {
    if (!items || items.length === 0) return KITCHEN_DEFAULTS.DEFAULT_PREPARATION_TIME_MINUTES;

    const itemTimes = items.map(
      (item) =>
        item.estimatedPreparationMinutes ||
        KITCHEN_DEFAULTS.DEFAULT_PREPARATION_TIME_MINUTES,
    );

    const maxItemTime = Math.max(...itemTimes);
    const stationCount = new Set(items.map((item) => item.station)).size;

    return maxItemTime + Math.max(0, stationCount - 1) * 2;
  }

  private resolveDefaultStation(name: string): KitchenStationType {
    const lower = (name || '').toLowerCase();
    if (lower.includes('grill') || lower.includes('tikka') || lower.includes('kebab')) {
      return KitchenStationType.GRILL;
    }
    if (lower.includes('biryani') || lower.includes('curry') || lower.includes('dal') || lower.includes('paneer')) {
      return KitchenStationType.CURRY;
    }
    if (lower.includes('fry') || lower.includes('fries') || lower.includes('pakora')) {
      return KitchenStationType.FRY;
    }
    if (lower.includes('roti') || lower.includes('naan') || lower.includes('tandoor')) {
      return KitchenStationType.TANDOOR;
    }
    if (lower.includes('coffee') || lower.includes('tea') || lower.includes('shake') || lower.includes('juice') || lower.includes('drink')) {
      return KitchenStationType.BEVERAGE;
    }
    if (lower.includes('cake') || lower.includes('dessert') || lower.includes('ice cream') || lower.includes('gulab')) {
      return KitchenStationType.DESSERT;
    }
    return KitchenStationType.GENERAL;
  }

  private async getNextQueuePosition(
    tenantId: string,
    branchId: string,
  ): Promise<number> {
    const count = await this.ticketModel.countDocuments({
      tenantId,
      branchId,
      status: {
        $in: [
          KitchenTicketStatus.QUEUED,
          KitchenTicketStatus.ACCEPTED,
          KitchenTicketStatus.PREPARING,
        ],
      },
    });
    return count + 1;
  }

  private toSafeTicket(ticket: any): KitchenTicketResponse {
    const queuedTime = new Date(ticket.queuedAt || ticket.createdAt).getTime();
    const elapsedMinutes = Math.max(0, Math.floor((Date.now() - queuedTime) / 60000));

    return {
      id: ticket._id.toString(),
      tenantId: ticket.tenantId.toString(),
      restaurantId: ticket.restaurantId.toString(),
      branchId: ticket.branchId.toString(),
      orderId: ticket.orderId.toString(),
      orderNumber: ticket.orderNumber,

      status: ticket.status,
      priority: ticket.priority,

      items: (ticket.items || []).map((item: any) => ({
        id: item._id?.toString(),
        orderItemId: item.orderItemId?.toString(),
        menuItemId: item.menuItemId?.toString(),
        nameSnapshot: item.nameSnapshot,
        quantity: item.quantity,
        status: item.status,
        station: item.station,
        estimatedPreparationMinutes: item.estimatedPreparationMinutes ?? 15,
        elapsedPreparationMinutes: item.startedAt
          ? Math.max(0, Math.floor((Date.now() - new Date(item.startedAt).getTime()) / 60000))
          : 0,
        specialInstructions: item.specialInstructions,
        startedAt: item.startedAt,
        readyAt: item.readyAt,
        assignedStaffId: item.assignedStaffId?.toString(),
      })),

      estimatedPreparationMinutes: ticket.estimatedPreparationMinutes ?? 15,
      elapsedMinutes,

      queuedAt: ticket.queuedAt,
      acceptedAt: ticket.acceptedAt,
      startedAt: ticket.startedAt,
      readyAt: ticket.readyAt,
      completedAt: ticket.completedAt,

      assignedStaffId: ticket.assignedStaffId?.toString(),
      customerNote: ticket.customerNote,
      queuePosition: ticket.queuePosition ?? 1,

      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}
