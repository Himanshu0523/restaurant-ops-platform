import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Table,
  TableDocument,
} from './schemas/tables.schema.js';

import {
  TableStatus,
} from './tables.types.js';

import {
  CreateTableDto,
} from './dto/create-table.dto.js';

import {
  UpdateTableDto,
} from './dto/update-table.dto.js';

import {
  UpdateTableStatusDto,
} from './dto/update-table-status.dto.js';

import {
  TableQueryDto,
} from './dto/table-query.dto.js';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
  ) {}

  async create(
    tenantId: string,
    restaurantId: string,
    branchId: string,
    dto: CreateTableDto,
  ) {
    const existing = await this.tableModel.findOne({
      tenantId,
      restaurantId,
      branchId,
      tableNumber: dto.tableNumber,
      deletedAt: null,
    });

    if (existing) {
      throw new ConflictException(
        'A table with this number already exists in this branch',
      );
    }

    if (
      dto.minCapacity !== undefined &&
      dto.maxCapacity !== undefined &&
      dto.minCapacity > dto.maxCapacity
    ) {
      throw new BadRequestException(
        'minCapacity cannot be greater than maxCapacity',
      );
    }

    const table = await this.tableModel.create({
      tenantId,
      restaurantId,
      branchId,
      ...dto,
      status: TableStatus.AVAILABLE,
      isActive: true,
    });

    return this.toSafeTable(table);
  }

  async findById(
    tenantId: string,
    tableId: string,
  ) {
    const table = await this.tableModel.findOne({
      _id: tableId,
      tenantId,
      deletedAt: null,
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return this.toSafeTable(table);
  }

  async findByBranch(
    tenantId: string,
    branchId: string,
    query: TableQueryDto,
  ) {
    const {
      page = 1,
      limit = 20,
      ...filters
    } = query;

    const filter: Record<string, any> = {
      tenantId,
      branchId,
      deletedAt: null,
    };

    if (filters.status) {
      filter.status = filters.status;
    }

    if (filters.type) {
      filter.type = filters.type;
    }

    if (filters.floor) {
      filter.floor = filters.floor;
    }

    if (filters.zone) {
      filter.zone = filters.zone;
    }

    if (filters.isActive !== undefined) {
      filter.isActive = filters.isActive;
    }

    if (filters.minCapacity !== undefined) {
      filter.capacity = {
        ...(filter.capacity || {}),
        $gte: filters.minCapacity,
      };
    }

    if (filters.maxCapacity !== undefined) {
      filter.capacity = {
        ...(filter.capacity || {}),
        $lte: filters.maxCapacity,
      };
    }

    const skip = (page - 1) * limit;

    const [tables, total] = await Promise.all([
      this.tableModel
        .find(filter)
        .sort({ tableNumber: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.tableModel.countDocuments(filter),
    ]);

    return {
      data: tables.map((table) => this.toSafeTable(table)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(
    tenantId: string,
    tableId: string,
    dto: UpdateTableDto,
  ) {
    const table = await this.tableModel.findOne({
      _id: tableId,
      tenantId,
      deletedAt: null,
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    if (
      dto.tableNumber &&
      dto.tableNumber !== table.tableNumber
    ) {
      const duplicate = await this.tableModel.findOne({
        tenantId,
        branchId: table.branchId,
        tableNumber: dto.tableNumber,
        deletedAt: null,
        _id: { $ne: table._id },
      });

      if (duplicate) {
        throw new ConflictException(
          'A table with this number already exists in this branch',
        );
      }
    }

    if (
      dto.minCapacity !== undefined &&
      dto.maxCapacity !== undefined &&
      dto.minCapacity > dto.maxCapacity
    ) {
      throw new BadRequestException(
        'minCapacity cannot be greater than maxCapacity',
      );
    }

    Object.assign(table, dto);

    await table.save();

    return this.toSafeTable(table);
  }

  async updateStatus(
    tenantId: string,
    tableId: string,
    dto: UpdateTableStatusDto,
  ) {
    const table = await this.tableModel.findOne({
      _id: tableId,
      tenantId,
      deletedAt: null,
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    const previousStatus = table.status;

    table.status = dto.status;

    await table.save();

    return {
      table: this.toSafeTable(table),
      transition: {
        from: previousStatus,
        to: dto.status,
      },
      reason: dto.reason,
    };
  }

  async softDelete(
    tenantId: string,
    tableId: string,
  ) {
    const table = await this.tableModel.findOne({
      _id: tableId,
      tenantId,
      deletedAt: null,
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    if (table.status === TableStatus.OCCUPIED) {
      throw new BadRequestException(
        'Occupied tables cannot be deleted',
      );
    }

    table.deletedAt = new Date();
    table.isActive = false;

    await table.save();

    return {
      message: 'Table deleted successfully',
    };
  }

  private toSafeTable(table: any) {
    return {
      id: table._id,
      tenantId: table.tenantId,
      restaurantId: table.restaurantId,
      branchId: table.branchId,

      tableNumber: table.tableNumber,
      label: table.label,
      description: table.description,

      type: table.type,
      shape: table.shape,

      capacity: table.capacity,
      minCapacity: table.minCapacity,
      maxCapacity: table.maxCapacity,

      status: table.status,

      floor: table.floor,
      zone: table.zone,

      position: table.position,

      qrCodeToken: table.qrCodeToken,
      qrCodeUrl: table.qrCodeUrl,

      currentOrderId: table.currentOrderId,
      currentReservationId: table.currentReservationId,

      settings: table.settings,

      isActive: table.isActive,

      createdAt: table.createdAt,
      updatedAt: table.updatedAt,
    };
  }
}