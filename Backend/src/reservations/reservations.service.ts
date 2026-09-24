import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Reservation,
  ReservationDocument,
} from './schemas/reservation.schema.js';
import {
  ReservationSlot,
  ReservationSlotDocument,
} from './schemas/reservation-slot.schema.js';
import { Table, TableDocument } from '../tables/schemas/tables.schema.js';

import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationDto } from './dto/update-reservation.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';
import { AssignReservationTableDto } from './dto/assign-reservation-table.dto.js';
import { CheckInReservationDto } from './dto/check-in-reservation.dto.js';
import { CancelReservationDto } from './dto/cancel-reservation.dto.js';
import { AvailabilityQueryDto } from './dto/availability-query.dto.js';
import { ReservationQueryDto } from './dto/reservation-query.dto.js';

import {
  ReservationSource,
  ReservationStatus,
} from './reservation.types.js';

import {
  DEFAULT_RESERVATION_DURATION_MINUTES,
  DEFAULT_SLOT_GRANULARITY_MINUTES,
  MAX_RESERVATION_DAYS_AHEAD,
  RESERVATION_NUMBER_PREFIX,
} from './constants/reservation.constants.js';

import {
  AvailabilityResponse,
  ReservationResponse,
} from './interfaces/reservation.interface.js';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,

    @InjectModel(ReservationSlot.name)
    private readonly slotModel: Model<ReservationSlotDocument>,

    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
  ) {}

  async create(
    context: { tenantId: string; restaurantId: string; userId?: string },
    branchId: string,
    dto: CreateReservationDto,
  ): Promise<ReservationResponse> {
    const startAt = new Date(dto.startAt);
    const now = new Date();

    if (isNaN(startAt.getTime()) || startAt <= now) {
      throw new BadRequestException('Reservation start time must be in the future');
    }

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + MAX_RESERVATION_DAYS_AHEAD);
    if (startAt > maxDate) {
      throw new BadRequestException(
        `Reservations cannot be made more than ${MAX_RESERVATION_DAYS_AHEAD} days in advance`,
      );
    }

    const durationMinutes =
      dto.durationMinutes || DEFAULT_RESERVATION_DURATION_MINUTES;
    const endAt = new Date(startAt.getTime() + durationMinutes * 60000);

    const requiredSlots = this.generateTimeSlots(startAt, endAt);

    let assignedTableId: Types.ObjectId | undefined;

    if (dto.tableId) {
      const table = await this.tableModel.findOne({
        _id: dto.tableId,
        tenantId: context.tenantId,
        branchId,
      });

      if (!table) {
        throw new NotFoundException('Specified table not found');
      }

      if (table.capacity < dto.guestCount) {
        throw new BadRequestException(
          `Table capacity (${table.capacity}) is less than guest count (${dto.guestCount})`,
        );
      }

      const conflictingSlot = await this.slotModel.findOne({
        branchId,
        tableId: dto.tableId,
        slotStart: { $in: requiredSlots },
      });

      if (conflictingSlot) {
        throw new ConflictException(
          'Selected table is not available for the requested time period',
        );
      }

      assignedTableId = table._id;
    } else {
      // Auto-assign table if available
      const compatibleTables = await this.tableModel
        .find({
          tenantId: context.tenantId,
          branchId,
          capacity: { $gte: dto.guestCount },
        })
        .sort({ capacity: 1 });

      for (const table of compatibleTables) {
        const conflictingSlot = await this.slotModel.findOne({
          branchId,
          tableId: table._id,
          slotStart: { $in: requiredSlots },
        });

        if (!conflictingSlot) {
          assignedTableId = table._id;
          break;
        }
      }
    }

    const reservationNumber = `${RESERVATION_NUMBER_PREFIX}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const reservation = await this.reservationModel.create({
      tenantId: new Types.ObjectId(context.tenantId),
      restaurantId: new Types.ObjectId(context.restaurantId),
      branchId: new Types.ObjectId(branchId),
      customerId: context.userId ? new Types.ObjectId(context.userId) : undefined,
      tableId: assignedTableId,
      reservationNumber,
      guestCount: dto.guestCount,
      startAt,
      endAt,
      durationMinutes,
      status: ReservationStatus.PENDING,
      source: dto.source || ReservationSource.CUSTOMER_APP,
      guest: {
        name: dto.guestName,
        phone: dto.guestPhone,
        email: dto.guestEmail,
      },
      preferences: {
        preferences: dto.preferences || [],
      },
      specialRequests: dto.specialRequests,
      createdBy: context.userId ? new Types.ObjectId(context.userId) : undefined,
    });

    if (assignedTableId) {
      await this.createReservationSlots(
        context.tenantId,
        branchId,
        assignedTableId.toString(),
        reservation._id.toString(),
        requiredSlots,
      );
    }

    return this.toResponse(reservation);
  }

  async getAvailability(
    context: { tenantId: string },
    branchId: string,
    query: AvailabilityQueryDto,
  ): Promise<AvailabilityResponse> {
    const startAt = new Date(query.startAt);
    const durationMinutes =
      query.durationMinutes || DEFAULT_RESERVATION_DURATION_MINUTES;
    const endAt = new Date(startAt.getTime() + durationMinutes * 60000);

    const requiredSlots = this.generateTimeSlots(startAt, endAt);

    const tables = await this.tableModel
      .find({
        tenantId: context.tenantId,
        branchId,
        capacity: { $gte: query.guestCount },
      })
      .sort({ capacity: 1 })
      .lean();

    const busyTableSlots = await this.slotModel.distinct('tableId', {
      branchId,
      slotStart: { $in: requiredSlots },
    });

    const busyTableIds = new Set(busyTableSlots.map((id) => id.toString()));

    const availableTables = tables
      .filter((table) => !busyTableIds.has(table._id.toString()))
      .map((table) => ({
        id: table._id.toString(),
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        minCapacity: table.minCapacity,
        maxCapacity: table.maxCapacity,
        type: table.type,
        shape: table.shape,
        floor: table.floor,
        isVip: table.settings?.isVip ?? false,
      }));

    return {
      startAt,
      endAt,
      durationMinutes,
      guestCount: query.guestCount,
      availableTables,
      totalAvailable: availableTables.length,
    };
  }

  async findByBranch(
    context: { tenantId: string },
    branchId: string,
    query: ReservationQueryDto,
  ) {
    const { page = 1, limit = 20, ...filters } = query;

    const filter: Record<string, any> = {
      tenantId: context.tenantId,
      branchId,
    };

    if (filters.status) {
      filter.status = filters.status;
    }

    if (filters.search) {
      filter.$or = [
        { reservationNumber: { $regex: filters.search, $options: 'i' } },
        { 'guest.name': { $regex: filters.search, $options: 'i' } },
        { 'guest.phone': { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [reservations, total] = await Promise.all([
      this.reservationModel
        .find(filter)
        .sort({ startAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.reservationModel.countDocuments(filter),
    ]);

    return {
      data: reservations.map((res) => this.toResponse(res)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(
    context: { tenantId: string },
    reservationId: string,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel
      .findOne({
        _id: reservationId,
        tenantId: context.tenantId,
      })
      .lean();

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.toResponse(reservation);
  }

  async findCustomerReservations(
    context: { tenantId: string },
    customerId: string,
  ) {
    const reservations = await this.reservationModel
      .find({
        tenantId: context.tenantId,
        customerId,
      })
      .sort({ startAt: -1 })
      .lean();

    return reservations.map((res) => this.toResponse(res));
  }

  async update(
    context: { tenantId: string },
    reservationId: string,
    dto: UpdateReservationDto,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      tenantId: context.tenantId,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (dto.guestCount) reservation.guestCount = dto.guestCount;
    if (dto.specialRequests !== undefined) reservation.specialRequests = dto.specialRequests;
    if (dto.notes !== undefined) reservation.notes = dto.notes;

    if (dto.startAt || dto.durationMinutes) {
      const startAt = dto.startAt ? new Date(dto.startAt) : reservation.startAt;
      const durationMinutes = dto.durationMinutes || reservation.durationMinutes;
      const endAt = new Date(startAt.getTime() + durationMinutes * 60000);

      if (reservation.tableId) {
        const requiredSlots = this.generateTimeSlots(startAt, endAt);
        const conflictingSlot = await this.slotModel.findOne({
          branchId: reservation.branchId,
          tableId: reservation.tableId,
          reservationId: { $ne: reservation._id },
          slotStart: { $in: requiredSlots },
        });

        if (conflictingSlot) {
          throw new ConflictException(
            'Updated reservation time conflicts with another booking for assigned table',
          );
        }

        await this.slotModel.deleteMany({ reservationId: reservation._id });
        await this.createReservationSlots(
          context.tenantId,
          reservation.branchId.toString(),
          reservation.tableId.toString(),
          reservation._id.toString(),
          requiredSlots,
        );
      }

      reservation.startAt = startAt;
      reservation.durationMinutes = durationMinutes;
      reservation.endAt = endAt;
    }

    await reservation.save();
    return this.toResponse(reservation);
  }

  async updateStatus(
    context: { tenantId: string },
    reservationId: string,
    dto: UpdateReservationStatusDto,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      tenantId: context.tenantId,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = dto.status;
    await reservation.save();
    return this.toResponse(reservation);
  }

  async assignTable(
    context: { tenantId: string; userId?: string },
    reservationId: string,
    dto: AssignReservationTableDto,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      tenantId: context.tenantId,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const table = await this.tableModel.findOne({
      _id: dto.tableId,
      tenantId: context.tenantId,
      branchId: reservation.branchId,
    });

    if (!table) {
      throw new NotFoundException('Table not found in branch');
    }

    const requiredSlots = this.generateTimeSlots(
      reservation.startAt,
      reservation.endAt,
    );

    const conflictingSlot = await this.slotModel.findOne({
      branchId: reservation.branchId,
      tableId: dto.tableId,
      reservationId: { $ne: reservation._id },
      slotStart: { $in: requiredSlots },
    });

    if (conflictingSlot) {
      throw new ConflictException('Table is already reserved for this time slot');
    }

    await this.slotModel.deleteMany({ reservationId: reservation._id });

    await this.createReservationSlots(
      context.tenantId,
      reservation.branchId.toString(),
      dto.tableId,
      reservation._id.toString(),
      requiredSlots,
    );

    reservation.tableId = new Types.ObjectId(dto.tableId);
    if (context.userId) {
      reservation.assignedBy = new Types.ObjectId(context.userId);
    }

    await reservation.save();
    return this.toResponse(reservation);
  }

  async confirm(
    context: { tenantId: string },
    reservationId: string,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      tenantId: context.tenantId,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = ReservationStatus.CONFIRMED;
    await reservation.save();
    return this.toResponse(reservation);
  }

  async checkIn(
    context: { tenantId: string },
    reservationId: string,
    dto?: CheckInReservationDto,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      tenantId: context.tenantId,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (dto?.tableId) {
      await this.assignTable(context, reservationId, { tableId: dto.tableId });
    }

    reservation.status = ReservationStatus.CHECKED_IN;
    reservation.checkedInAt = new Date();
    await reservation.save();

    return this.toResponse(reservation);
  }

  async seat(
    context: { tenantId: string },
    reservationId: string,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      tenantId: context.tenantId,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = ReservationStatus.SEATED;
    reservation.seatedAt = new Date();
    await reservation.save();

    return this.toResponse(reservation);
  }

  async complete(
    context: { tenantId: string },
    reservationId: string,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      tenantId: context.tenantId,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = ReservationStatus.COMPLETED;
    reservation.completedAt = new Date();

    await this.slotModel.deleteMany({ reservationId: reservation._id });
    await reservation.save();

    return this.toResponse(reservation);
  }

  async cancel(
    context: { tenantId: string },
    reservationId: string,
    dto?: CancelReservationDto,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      tenantId: context.tenantId,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = ReservationStatus.CANCELLED;
    if (dto?.reason) {
      reservation.cancellationReason = dto.reason;
    }

    await this.slotModel.deleteMany({ reservationId: reservation._id });
    await reservation.save();

    return this.toResponse(reservation);
  }

  async markNoShow(
    context: { tenantId: string },
    reservationId: string,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      tenantId: context.tenantId,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = ReservationStatus.NO_SHOW;
    reservation.noShowAt = new Date();

    await this.slotModel.deleteMany({ reservationId: reservation._id });
    await reservation.save();

    return this.toResponse(reservation);
  }

  private generateTimeSlots(startAt: Date, endAt: Date): Date[] {
    const slots: Date[] = [];
    let current = new Date(startAt.getTime());
    const stepMs = DEFAULT_SLOT_GRANULARITY_MINUTES * 60000;

    while (current < endAt) {
      slots.push(new Date(current.getTime()));
      current = new Date(current.getTime() + stepMs);
    }

    return slots;
  }

  private async createReservationSlots(
    tenantId: string,
    branchId: string,
    tableId: string,
    reservationId: string,
    slotStarts: Date[],
  ): Promise<void> {
    const stepMs = DEFAULT_SLOT_GRANULARITY_MINUTES * 60000;
    const docs = slotStarts.map((slotStart) => ({
      tenantId: new Types.ObjectId(tenantId),
      branchId: new Types.ObjectId(branchId),
      tableId: new Types.ObjectId(tableId),
      reservationId: new Types.ObjectId(reservationId),
      slotStart,
      slotEnd: new Date(slotStart.getTime() + stepMs),
    }));

    try {
      await this.slotModel.insertMany(docs, { ordered: true });
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException(
          'Time slot collision detected for the selected table',
        );
      }
      throw err;
    }
  }

  private toResponse(reservation: any): ReservationResponse {
    return {
      id: reservation._id.toString(),
      tenantId: reservation.tenantId.toString(),
      restaurantId: reservation.restaurantId.toString(),
      branchId: reservation.branchId.toString(),
      customerId: reservation.customerId?.toString(),
      tableId: reservation.tableId?.toString(),
      reservationNumber: reservation.reservationNumber,
      guestCount: reservation.guestCount,
      startAt: reservation.startAt,
      endAt: reservation.endAt,
      durationMinutes: reservation.durationMinutes,
      status: reservation.status,
      source: reservation.source,
      guest: reservation.guest,
      preferences: reservation.preferences,
      specialRequests: reservation.specialRequests,
      cancellationReason: reservation.cancellationReason,
      checkedInAt: reservation.checkedInAt,
      seatedAt: reservation.seatedAt,
      completedAt: reservation.completedAt,
      noShowAt: reservation.noShowAt,
      createdBy: reservation.createdBy?.toString(),
      assignedBy: reservation.assignedBy?.toString(),
      notes: reservation.notes,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    };
  }
}
