import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  InventoryItem,
  InventoryItemDocument,
} from './schemas/inventory-item.schema.js';

import {
  InventoryLot,
  InventoryLotDocument,
} from './schemas/inventory-lot.schema.js';

import {
  InventoryMovement,
  InventoryMovementDocument,
} from './schemas/inventory-movement.schema.js';

import {
  Ingredient,
  IngredientDocument,
} from '../ingredients/schemas/ingredient.schema.js';

import { CreateInventoryItemDto } from './dto/create-inventory-item.dto.js';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto.js';
import { ReceiveStockDto } from './dto/receive-stock.dto.js';
import { AdjustStockDto } from './dto/adjust-stock.dto.js';
import { RecordWasteDto } from './dto/record-waste.dto.js';
import { TransferStockDto } from './dto/transfer-stock.dto.js';
import { UpdateInventoryStatusDto } from './dto/update-inventory-status.dto.js';
import { InventoryQueryDto } from './dto/inventory-query.dto.js';

import {
  InventoryLotStatus,
  InventoryMovementType,
  InventoryReferenceType,
  InventoryStatus,
} from './inventory.types.js';

import { InventoryItemResponse } from './interfaces/inventory.interface.js';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name)
    private readonly itemModel: Model<InventoryItemDocument>,

    @InjectModel(InventoryLot.name)
    private readonly lotModel: Model<InventoryLotDocument>,

    @InjectModel(InventoryMovement.name)
    private readonly movementModel: Model<InventoryMovementDocument>,

    @InjectModel(Ingredient.name)
    private readonly ingredientModel: Model<IngredientDocument>,
  ) {}

  async create(
    context: { tenantId: string; restaurantId: string; userId: string },
    branchId: string,
    dto: CreateInventoryItemDto,
  ): Promise<InventoryItemResponse> {
    const ingredient = await this.ingredientModel.findOne({
      _id: dto.ingredientId,
      tenantId: context.tenantId,
      branchId,
      deletedAt: null,
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found in this branch');
    }

    const existing = await this.itemModel.findOne({
      tenantId: context.tenantId,
      branchId,
      ingredientId: dto.ingredientId,
      deletedAt: null,
    });

    if (existing) {
      throw new ConflictException(
        'Inventory item already exists for this ingredient',
      );
    }

    const item = await this.itemModel.create({
      tenantId: context.tenantId,
      restaurantId: context.restaurantId,
      branchId,
      ingredientId: dto.ingredientId,
      currentQuantity: 0,
      reservedQuantity: 0,
      reorderLevel: dto.reorderLevel ?? 0,
      reorderQuantity: dto.reorderQuantity ?? 0,
      averageUnitCost: 0,
      status: InventoryStatus.OUT_OF_STOCK,
      isActive: true,
    });

    return this.toSafeInventoryItem(item);
  }

  async findById(
    context: { tenantId: string },
    inventoryItemId: string,
  ): Promise<InventoryItemResponse> {
    const item = await this.itemModel
      .findOne({
        _id: inventoryItemId,
        tenantId: context.tenantId,
        deletedAt: null,
      })
      .lean();

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    return this.toSafeInventoryItem(item);
  }

  async findByBranch(
    context: { tenantId: string },
    branchId: string,
    query: InventoryQueryDto,
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

    if (filters.isActive !== undefined) {
      filter.isActive = filters.isActive;
    }

    if (filters.lowStock) {
      filter.status = {
        $in: [InventoryStatus.LOW_STOCK, InventoryStatus.OUT_OF_STOCK],
      };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.itemModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.itemModel.countDocuments(filter),
    ]);

    return {
      data: items.map((item) => this.toSafeInventoryItem(item)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(
    context: { tenantId: string },
    inventoryItemId: string,
    dto: UpdateInventoryItemDto,
  ): Promise<InventoryItemResponse> {
    const item = await this.itemModel.findOne({
      _id: inventoryItemId,
      tenantId: context.tenantId,
      deletedAt: null,
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    if (dto.reorderLevel !== undefined) {
      item.reorderLevel = dto.reorderLevel;
    }

    if (dto.reorderQuantity !== undefined) {
      item.reorderQuantity = dto.reorderQuantity;
    }

    item.status = this.calculateStatus(
      item.currentQuantity,
      item.reservedQuantity,
      item.reorderLevel,
    );

    await item.save();

    return this.toSafeInventoryItem(item);
  }

  async receiveStock(
    context: { tenantId: string; userId: string },
    inventoryItemId: string,
    dto: ReceiveStockDto,
  ): Promise<InventoryItemResponse> {
    const item = await this.itemModel.findOne({
      _id: inventoryItemId,
      tenantId: context.tenantId,
      deletedAt: null,
      isActive: true,
    });

    if (!item) {
      throw new NotFoundException('Active inventory item not found');
    }

    const previousQuantity = item.currentQuantity;
    const newQuantity = previousQuantity + dto.quantity;

    // Calculate new moving average unit cost
    const totalCurrentCost = item.currentQuantity * item.averageUnitCost;
    const incomingCost = dto.quantity * dto.unitCost;
    const newAverageCost =
      newQuantity > 0 ? (totalCurrentCost + incomingCost) / newQuantity : dto.unitCost;

    item.currentQuantity = newQuantity;
    item.averageUnitCost = newAverageCost;
    item.status = this.calculateStatus(
      newQuantity,
      item.reservedQuantity,
      item.reorderLevel,
    );

    await item.save();

    // Create lot
    await this.lotModel.create({
      tenantId: item.tenantId,
      branchId: item.branchId,
      ingredientId: item.ingredientId,
      inventoryItemId: item._id,
      batchNumber: dto.batchNumber,
      quantityReceived: dto.quantity,
      remainingQuantity: dto.quantity,
      unitCost: dto.unitCost,
      supplier: dto.supplier,
      receivedAt: new Date(),
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      status: InventoryLotStatus.ACTIVE,
    });

    // Create immutable movement
    await this.movementModel.create({
      tenantId: item.tenantId,
      branchId: item.branchId,
      ingredientId: item.ingredientId,
      inventoryItemId: item._id,
      type: InventoryMovementType.RECEIPT,
      quantity: dto.quantity,
      beforeQuantity: previousQuantity,
      afterQuantity: newQuantity,
      referenceType: InventoryReferenceType.PURCHASE,
      performedBy: new Types.ObjectId(context.userId),
      reason: dto.reason ?? 'Stock received',
    });

    return this.toSafeInventoryItem(item);
  }

  async adjustStock(
    context: { tenantId: string; userId: string },
    inventoryItemId: string,
    dto: AdjustStockDto,
  ): Promise<InventoryItemResponse> {
    const item = await this.itemModel.findOne({
      _id: inventoryItemId,
      tenantId: context.tenantId,
      deletedAt: null,
      isActive: true,
    });

    if (!item) {
      throw new NotFoundException('Active inventory item not found');
    }

    const previousQuantity = item.currentQuantity;
    const newQuantity = previousQuantity + dto.quantity;

    if (newQuantity < 0) {
      throw new BadRequestException('Adjustment cannot reduce stock below zero');
    }

    if (newQuantity < item.reservedQuantity) {
      throw new BadRequestException(
        'Adjustment would breach reserved quantity limit',
      );
    }

    item.currentQuantity = newQuantity;
    item.status = this.calculateStatus(
      newQuantity,
      item.reservedQuantity,
      item.reorderLevel,
    );

    await item.save();

    await this.movementModel.create({
      tenantId: item.tenantId,
      branchId: item.branchId,
      ingredientId: item.ingredientId,
      inventoryItemId: item._id,
      type:
        dto.quantity >= 0
          ? InventoryMovementType.ADJUSTMENT_IN
          : InventoryMovementType.ADJUSTMENT_OUT,
      quantity: Math.abs(dto.quantity),
      beforeQuantity: previousQuantity,
      afterQuantity: newQuantity,
      referenceType: InventoryReferenceType.MANUAL,
      performedBy: new Types.ObjectId(context.userId),
      reason: dto.reason,
    });

    return this.toSafeInventoryItem(item);
  }

  async recordWaste(
    context: { tenantId: string; userId: string },
    inventoryItemId: string,
    dto: RecordWasteDto,
  ): Promise<InventoryItemResponse> {
    const item = await this.itemModel.findOne({
      _id: inventoryItemId,
      tenantId: context.tenantId,
      deletedAt: null,
      isActive: true,
    });

    if (!item) {
      throw new NotFoundException('Active inventory item not found');
    }

    const available = item.currentQuantity - item.reservedQuantity;
    if (available < dto.quantity) {
      throw new BadRequestException('Insufficient available stock to record waste');
    }

    const previousQuantity = item.currentQuantity;
    const newQuantity = previousQuantity - dto.quantity;

    item.currentQuantity = newQuantity;
    item.status = this.calculateStatus(
      newQuantity,
      item.reservedQuantity,
      item.reorderLevel,
    );

    await item.save();

    if (dto.batchNumber) {
      const lot = await this.lotModel.findOne({
        inventoryItemId: item._id,
        batchNumber: dto.batchNumber,
        status: InventoryLotStatus.ACTIVE,
      });

      if (lot) {
        lot.remainingQuantity = Math.max(0, lot.remainingQuantity - dto.quantity);
        if (lot.remainingQuantity === 0) {
          lot.status = InventoryLotStatus.DEPLETED;
        }
        await lot.save();
      }
    }

    await this.movementModel.create({
      tenantId: item.tenantId,
      branchId: item.branchId,
      ingredientId: item.ingredientId,
      inventoryItemId: item._id,
      type: InventoryMovementType.WASTE,
      quantity: -dto.quantity,
      beforeQuantity: previousQuantity,
      afterQuantity: newQuantity,
      referenceType: InventoryReferenceType.WASTE,
      performedBy: new Types.ObjectId(context.userId),
      reason: dto.reason,
    });

    return this.toSafeInventoryItem(item);
  }

  async transferStock(
    context: { tenantId: string; userId: string },
    sourceBranchId: string,
    dto: TransferStockDto,
  ) {
    if (dto.sourceBranchId === dto.destinationBranchId) {
      throw new BadRequestException(
        'Source and destination branches must be different',
      );
    }

    const sourceItem = await this.itemModel.findOne({
      tenantId: context.tenantId,
      branchId: dto.sourceBranchId,
      ingredientId: dto.ingredientId,
      deletedAt: null,
      isActive: true,
    });

    if (!sourceItem) {
      throw new NotFoundException('Source inventory item not found');
    }

    const available = sourceItem.currentQuantity - sourceItem.reservedQuantity;
    if (available < dto.quantity) {
      throw new BadRequestException(
        'Insufficient available stock at source branch',
      );
    }

    let destinationItem = await this.itemModel.findOne({
      tenantId: context.tenantId,
      branchId: dto.destinationBranchId,
      ingredientId: dto.ingredientId,
      deletedAt: null,
    });

    if (!destinationItem) {
      destinationItem = await this.itemModel.create({
        tenantId: context.tenantId,
        restaurantId: sourceItem.restaurantId,
        branchId: dto.destinationBranchId,
        ingredientId: dto.ingredientId,
        currentQuantity: 0,
        reservedQuantity: 0,
        reorderLevel: sourceItem.reorderLevel,
        reorderQuantity: sourceItem.reorderQuantity,
        averageUnitCost: sourceItem.averageUnitCost,
        status: InventoryStatus.OUT_OF_STOCK,
        isActive: true,
      });
    }

    const sourcePrev = sourceItem.currentQuantity;
    const sourceNew = sourcePrev - dto.quantity;
    sourceItem.currentQuantity = sourceNew;
    sourceItem.status = this.calculateStatus(
      sourceNew,
      sourceItem.reservedQuantity,
      sourceItem.reorderLevel,
    );
    await sourceItem.save();

    const destPrev = destinationItem.currentQuantity;
    const destNew = destPrev + dto.quantity;
    destinationItem.currentQuantity = destNew;
    destinationItem.status = this.calculateStatus(
      destNew,
      destinationItem.reservedQuantity,
      destinationItem.reorderLevel,
    );
    await destinationItem.save();

    const transferRefId = new Types.ObjectId();

    await this.movementModel.create({
      tenantId: sourceItem.tenantId,
      branchId: sourceItem.branchId,
      ingredientId: sourceItem.ingredientId,
      inventoryItemId: sourceItem._id,
      type: InventoryMovementType.TRANSFER_OUT,
      quantity: -dto.quantity,
      beforeQuantity: sourcePrev,
      afterQuantity: sourceNew,
      referenceType: InventoryReferenceType.TRANSFER,
      referenceId: transferRefId,
      performedBy: new Types.ObjectId(context.userId),
      reason: dto.reason ?? `Transfer to branch ${dto.destinationBranchId}`,
    });

    await this.movementModel.create({
      tenantId: destinationItem.tenantId,
      branchId: destinationItem.branchId,
      ingredientId: destinationItem.ingredientId,
      inventoryItemId: destinationItem._id,
      type: InventoryMovementType.TRANSFER_IN,
      quantity: dto.quantity,
      beforeQuantity: destPrev,
      afterQuantity: destNew,
      referenceType: InventoryReferenceType.TRANSFER,
      referenceId: transferRefId,
      performedBy: new Types.ObjectId(context.userId),
      reason: dto.reason ?? `Transfer from branch ${dto.sourceBranchId}`,
    });

    return {
      message: 'Stock transferred successfully',
      source: this.toSafeInventoryItem(sourceItem),
      destination: this.toSafeInventoryItem(destinationItem),
    };
  }

  async getMovements(
    context: { tenantId: string },
    inventoryItemId: string,
  ) {
    const item = await this.itemModel.findOne({
      _id: inventoryItemId,
      tenantId: context.tenantId,
      deletedAt: null,
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    return this.movementModel
      .find({
        tenantId: context.tenantId,
        inventoryItemId,
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateStatus(
    context: { tenantId: string },
    inventoryItemId: string,
    dto: UpdateInventoryStatusDto,
  ): Promise<InventoryItemResponse> {
    const item = await this.itemModel.findOne({
      _id: inventoryItemId,
      tenantId: context.tenantId,
      deletedAt: null,
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    item.status = dto.status;
    item.isActive = dto.status !== InventoryStatus.INACTIVE;

    await item.save();

    return this.toSafeInventoryItem(item);
  }

  async softDelete(
    context: { tenantId: string },
    inventoryItemId: string,
  ) {
    const item = await this.itemModel.findOne({
      _id: inventoryItemId,
      tenantId: context.tenantId,
      deletedAt: null,
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    item.deletedAt = new Date();
    item.isActive = false;
    item.status = InventoryStatus.INACTIVE;

    await item.save();

    return {
      message: 'Inventory item deleted successfully',
    };
  }

  private calculateStatus(
    currentQuantity: number,
    reservedQuantity: number,
    reorderLevel: number,
  ): InventoryStatus {
    const available = currentQuantity - reservedQuantity;

    if (available <= 0) {
      return InventoryStatus.OUT_OF_STOCK;
    }

    if (available <= reorderLevel) {
      return InventoryStatus.LOW_STOCK;
    }

    return InventoryStatus.IN_STOCK;
  }

  private toSafeInventoryItem(item: any): InventoryItemResponse {
    const current = item.currentQuantity ?? 0;
    const reserved = item.reservedQuantity ?? 0;
    const available = Math.max(0, current - reserved);

    return {
      id: item._id.toString(),
      tenantId: item.tenantId.toString(),
      restaurantId: item.restaurantId.toString(),
      branchId: item.branchId.toString(),
      ingredientId: item.ingredientId.toString(),

      currentQuantity: current,
      reservedQuantity: reserved,
      availableQuantity: available,

      reorderLevel: item.reorderLevel ?? 0,
      reorderQuantity: item.reorderQuantity ?? 0,
      averageUnitCost: item.averageUnitCost ?? 0,

      status: item.status,
      isActive: item.isActive ?? true,
    };
  }
}
