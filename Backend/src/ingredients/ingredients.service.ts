import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Ingredient,
  IngredientDocument,
} from './schemas/ingredient.schema.js';

import {
  CreateIngredientDto,
} from './dto/create-ingredient.dto.js';

import {
  UpdateIngredientDto,
} from './dto/update-ingredient.dto.js';

import {
  UpdateIngredientStatusDto,
} from './dto/update-ingredient-status.dto.js';

import {
  IngredientQueryDto,
} from './dto/ingredient-query.dto.js';

import {
  IngredientStatus,
} from './ingredient.types.js';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredient.name)
    private readonly ingredientModel: Model<IngredientDocument>,
  ) {}

  async create(
    tenantId: string,
    restaurantId: string,
    branchId: string,
    dto: CreateIngredientDto,
  ) {
    const existing = await this.ingredientModel.findOne({
      tenantId,
      branchId,
      name: dto.name,
      deletedAt: null,
    });

    if (existing) {
      throw new ConflictException(
        'Ingredient already exists in this branch',
      );
    }

    if (dto.sku) {
      const skuExists = await this.ingredientModel.findOne({
        tenantId,
        branchId,
        sku: dto.sku,
        deletedAt: null,
      });

      if (skuExists) {
        throw new ConflictException(
          'Ingredient SKU already exists',
        );
      }
    }

    const ingredient = await this.ingredientModel.create({
      tenantId,
      restaurantId,
      branchId,
      ...dto,
      status: IngredientStatus.ACTIVE,
      isActive: true,
    });

    return this.toSafeIngredient(ingredient);
  }

  async findById(tenantId: string, ingredientId: string) {
    const ingredient = await this.ingredientModel
      .findOne({
        _id: ingredientId,
        tenantId,
        deletedAt: null,
      })
      .lean();

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    return this.toSafeIngredient(ingredient);
  }

  async findByBranch(
    tenantId: string,
    branchId: string,
    query: IngredientQueryDto,
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

    if (filters.search) {
      filter.name = {
        $regex: filters.search,
        $options: 'i',
      };
    }

    if (filters.category) {
      filter.category = filters.category;
    }

    if (filters.status) {
      filter.status = filters.status;
    }

    if (filters.storageType) {
      filter.storageType = filters.storageType;
    }

    if (filters.isPerishable !== undefined) {
      filter.isPerishable = filters.isPerishable;
    }

    if (filters.isActive !== undefined) {
      filter.isActive = filters.isActive;
    }

    const skip = (page - 1) * limit;

    const [ingredients, total] = await Promise.all([
      this.ingredientModel
        .find(filter)
        .sort({
          name: 1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.ingredientModel.countDocuments(filter),
    ]);

    return {
      data: ingredients.map((ingredient) =>
        this.toSafeIngredient(ingredient),
      ),
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
    ingredientId: string,
    dto: UpdateIngredientDto,
  ) {
    const ingredient = await this.ingredientModel.findOne({
      _id: ingredientId,
      tenantId,
      deletedAt: null,
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    if (dto.name && dto.name !== ingredient.name) {
      const duplicate = await this.ingredientModel.findOne({
        tenantId,
        branchId: ingredient.branchId,
        name: dto.name,
        deletedAt: null,
        _id: {
          $ne: ingredient._id,
        },
      });

      if (duplicate) {
        throw new ConflictException('Ingredient already exists');
      }
    }

    if (dto.sku && dto.sku !== ingredient.sku) {
      const duplicateSku = await this.ingredientModel.findOne({
        tenantId,
        branchId: ingredient.branchId,
        sku: dto.sku,
        deletedAt: null,
        _id: {
          $ne: ingredient._id,
        },
      });

      if (duplicateSku) {
        throw new ConflictException('Ingredient SKU already exists');
      }
    }

    Object.assign(ingredient, dto);
    await ingredient.save();

    return this.toSafeIngredient(ingredient);
  }

  async updateStatus(
    tenantId: string,
    ingredientId: string,
    dto: UpdateIngredientStatusDto,
  ) {
    const ingredient = await this.ingredientModel.findOne({
      _id: ingredientId,
      tenantId,
      deletedAt: null,
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    ingredient.status = dto.status;
    ingredient.isActive = dto.status === IngredientStatus.ACTIVE;

    await ingredient.save();

    return {
      ingredient: this.toSafeIngredient(ingredient),
      reason: dto.reason,
    };
  }

  async softDelete(tenantId: string, ingredientId: string) {
    const ingredient = await this.ingredientModel.findOne({
      _id: ingredientId,
      tenantId,
      deletedAt: null,
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    ingredient.deletedAt = new Date();
    ingredient.isActive = false;
    ingredient.status = IngredientStatus.INACTIVE;

    await ingredient.save();

    return {
      message: 'Ingredient deleted successfully',
    };
  }

  private toSafeIngredient(ingredient: any) {
    return {
      id: ingredient._id,
      tenantId: ingredient.tenantId,
      restaurantId: ingredient.restaurantId,
      branchId: ingredient.branchId,
      name: ingredient.name,
      description: ingredient.description,
      sku: ingredient.sku,
      category: ingredient.category,
      status: ingredient.status,
      baseUnit: ingredient.baseUnit,
      storageType: ingredient.storageType,
      isPerishable: ingredient.isPerishable,
      shelfLifeDays: ingredient.shelfLifeDays,
      allergenIds: ingredient.allergenIds,
      dietaryTags: ingredient.dietaryTags,
      reorderLevel: ingredient.reorderLevel,
      reorderQuantity: ingredient.reorderQuantity,
      estimatedUnitCost: ingredient.estimatedUnitCost,
      preferredSupplier: ingredient.preferredSupplier,
      isActive: ingredient.isActive,
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
    };
  }
}
