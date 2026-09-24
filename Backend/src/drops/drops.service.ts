import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Drop,
  DropDocument,
} from './schemas/drop.schema.js';

import {
  MenuItem,
  MenuItemDocument,
} from '../menu/schemas/menu-item.schema.js';

import { CreateDropDto } from './dto/create-drop.dto.js';
import { UpdateDropDto } from './dto/update-drop.dto.js';
import { PublishDropDto } from './dto/publish-drop.dto.js';
import { UpdateDropStatusDto } from './dto/update-drop-status.dto.js';
import { ReserveDropStockDto } from './dto/reserve-drop-stock.dto.js';
import { DropQueryDto } from './dto/drop-query.dto.js';

import { DropStatus } from './drop.types.js';
import { DropResponse } from './interfaces/drop.interface.js';

@Injectable()
export class DropsService {
  constructor(
    @InjectModel(Drop.name)
    private readonly dropModel: Model<DropDocument>,

    @InjectModel(MenuItem.name)
    private readonly menuItemModel: Model<MenuItemDocument>,
  ) {}

  async create(
    context: { tenantId: string; restaurantId: string; userId: string },
    branchId: string,
    dto: CreateDropDto,
  ): Promise<DropResponse> {
    const menuItem = await this.menuItemModel.findOne({
      _id: dto.menuItemId,
      tenantId: context.tenantId,
      branchId,
      deletedAt: null,
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found in this branch');
    }

    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);

    if (startAt >= endAt) {
      throw new BadRequestException('startAt must be before endAt');
    }

    const drop = await this.dropModel.create({
      tenantId: context.tenantId,
      restaurantId: context.restaurantId,
      branchId,
      menuItemId: dto.menuItemId,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      status: DropStatus.DRAFT,
      totalQuantity: dto.totalQuantity,
      remainingQuantity: dto.totalQuantity,
      reservedQuantity: 0,
      price: dto.price,
      originalPrice: dto.originalPrice ?? menuItem.price,
      availability: dto.availability,
      startAt,
      endAt,
      imageUrl: dto.imageUrl ?? menuItem.imageUrl,
      tags: dto.tags ?? [],
      isFeatured: dto.isFeatured ?? false,
      isActive: true,
      createdBy: new Types.ObjectId(context.userId),
    });

    return this.toSafeDrop(drop);
  }

  async findById(
    context: { tenantId: string },
    dropId: string,
  ): Promise<DropResponse> {
    const drop = await this.dropModel
      .findOne({
        _id: dropId,
        tenantId: context.tenantId,
        deletedAt: null,
      })
      .lean();

    if (!drop) {
      throw new NotFoundException('Drop not found');
    }

    return this.toSafeDrop(drop);
  }

  async findByBranch(
    context: { tenantId: string },
    branchId: string,
    query: DropQueryDto,
  ) {
    const {
      page = 1,
      limit = 20,
      ...filters
    } = query;

    const filter: Record<string, any> = {
      tenantId: context.tenantId,
      branchId,
      deletedAt: null,
    };

    if (filters.status) {
      filter.status = filters.status;
    }

    if (filters.type) {
      filter.type = filters.type;
    }

    if (filters.search) {
      filter.name = {
        $regex: filters.search,
        $options: 'i',
      };
    }

    const skip = (page - 1) * limit;

    const [drops, total] = await Promise.all([
      this.dropModel
        .find(filter)
        .sort({ startAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.dropModel.countDocuments(filter),
    ]);

    return {
      data: drops.map((drop) => this.toSafeDrop(drop)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findLiveDrops(
    context: { tenantId: string },
    branchId: string,
  ): Promise<DropResponse[]> {
    const now = new Date();

    const drops = await this.dropModel
      .find({
        tenantId: context.tenantId,
        branchId,
        status: DropStatus.LIVE,
        startAt: { $lte: now },
        endAt: { $gte: now },
        remainingQuantity: { $gt: 0 },
        isActive: true,
        deletedAt: null,
      })
      .sort({ isFeatured: -1, startAt: 1 })
      .lean();

    return drops.map((drop) => this.toSafeDrop(drop));
  }

  async update(
    context: { tenantId: string },
    dropId: string,
    dto: UpdateDropDto,
  ): Promise<DropResponse> {
    const drop = await this.dropModel.findOne({
      _id: dropId,
      tenantId: context.tenantId,
      deletedAt: null,
    });

    if (!drop) {
      throw new NotFoundException('Drop not found');
    }

    if (
      drop.status === DropStatus.ENDED ||
      drop.status === DropStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot update drop with status ${drop.status}`,
      );
    }

    if (dto.startAt && dto.endAt) {
      if (new Date(dto.startAt) >= new Date(dto.endAt)) {
        throw new BadRequestException('startAt must be before endAt');
      }
    }

    Object.assign(drop, dto);
    await drop.save();

    return this.toSafeDrop(drop);
  }

  async publish(
    context: { tenantId: string; userId: string },
    dropId: string,
    dto: PublishDropDto,
  ): Promise<DropResponse> {
    const drop = await this.dropModel.findOne({
      _id: dropId,
      tenantId: context.tenantId,
      deletedAt: null,
    });

    if (!drop) {
      throw new NotFoundException('Drop not found');
    }

    const now = new Date();
    if (now >= drop.startAt && now <= drop.endAt) {
      drop.status = DropStatus.LIVE;
    } else {
      drop.status = DropStatus.SCHEDULED;
    }

    drop.publishedBy = new Types.ObjectId(context.userId);
    await drop.save();

    return this.toSafeDrop(drop);
  }

  async updateStatus(
    context: { tenantId: string },
    dropId: string,
    dto: UpdateDropStatusDto,
  ): Promise<DropResponse> {
    const drop = await this.dropModel.findOne({
      _id: dropId,
      tenantId: context.tenantId,
      deletedAt: null,
    });

    if (!drop) {
      throw new NotFoundException('Drop not found');
    }

    drop.status = dto.status;
    if (
      dto.status === DropStatus.ENDED ||
      dto.status === DropStatus.CANCELLED
    ) {
      drop.isActive = false;
    }

    await drop.save();

    return this.toSafeDrop(drop);
  }

  async reserveStock(
    context: { tenantId: string },
    dropId: string,
    dto: ReserveDropStockDto,
  ): Promise<DropResponse> {
    const drop = await this.dropModel.findOneAndUpdate(
      {
        _id: dropId,
        tenantId: context.tenantId,
        status: DropStatus.LIVE,
        deletedAt: null,
        $expr: {
          $gte: ['$remainingQuantity', dto.quantity],
        },
      },
      {
        $inc: {
          remainingQuantity: -dto.quantity,
          reservedQuantity: dto.quantity,
        },
      },
      { new: true },
    );

    if (!drop) {
      throw new BadRequestException('Insufficient available stock or drop is not live');
    }

    if (drop.remainingQuantity === 0) {
      drop.status = DropStatus.SOLD_OUT;
      await drop.save();
    }

    return this.toSafeDrop(drop);
  }

  async releaseStock(
    context: { tenantId: string },
    dropId: string,
    dto: ReserveDropStockDto,
  ): Promise<DropResponse> {
    const drop = await this.dropModel.findOneAndUpdate(
      {
        _id: dropId,
        tenantId: context.tenantId,
        deletedAt: null,
        $expr: {
          $gte: ['$reservedQuantity', dto.quantity],
        },
      },
      {
        $inc: {
          remainingQuantity: dto.quantity,
          reservedQuantity: -dto.quantity,
        },
      },
      { new: true },
    );

    if (!drop) {
      throw new BadRequestException('Invalid release quantity or drop not found');
    }

    if (drop.status === DropStatus.SOLD_OUT && drop.remainingQuantity > 0) {
      drop.status = DropStatus.LIVE;
      await drop.save();
    }

    return this.toSafeDrop(drop);
  }

  async softDelete(
    context: { tenantId: string },
    dropId: string,
  ) {
    const drop = await this.dropModel.findOne({
      _id: dropId,
      tenantId: context.tenantId,
      deletedAt: null,
    });

    if (!drop) {
      throw new NotFoundException('Drop not found');
    }

    drop.deletedAt = new Date();
    drop.isActive = false;
    drop.status = DropStatus.CANCELLED;

    await drop.save();

    return {
      message: 'Drop deleted successfully',
    };
  }

  private toSafeDrop(drop: any): DropResponse {
    return {
      id: drop._id.toString(),
      tenantId: drop.tenantId.toString(),
      restaurantId: drop.restaurantId.toString(),
      branchId: drop.branchId.toString(),
      menuItemId: drop.menuItemId.toString(),

      name: drop.name,
      description: drop.description,
      type: drop.type,
      status: drop.status,

      totalQuantity: drop.totalQuantity,
      remainingQuantity: drop.remainingQuantity,
      reservedQuantity: drop.reservedQuantity,

      price: drop.price,
      originalPrice: drop.originalPrice,

      availability: drop.availability,
      startAt: drop.startAt,
      endAt: drop.endAt,

      imageUrl: drop.imageUrl,
      tags: drop.tags ?? [],
      isFeatured: drop.isFeatured ?? false,
      isActive: drop.isActive ?? true,
    };
  }
}
