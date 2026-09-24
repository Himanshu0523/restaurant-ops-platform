import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Menu,
  MenuDocument,
} from './schemas/menu.schema.js';

import {
  MenuCategory,
  MenuCategoryDocument,
} from './schemas/menu-category.schema.js';

import {
  MenuItem,
  MenuItemDocument,
} from './schemas/menu-item.schema.js';

import { CreateMenuDto } from './dto/create-menu.dto.js';
import { UpdateMenuDto } from './dto/update-menu.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateMenuItemDto } from './dto/create-menu-item.dto.js';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto.js';
import { UpdateMenuItemStatusDto } from './dto/update-menu-item-status.dto.js';
import { MenuQueryDto } from './dto/menu-query.dto.js';

import {
  MenuItemStatus,
  MenuStatus,
} from './menu.types.js';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name)
    private readonly menuModel: Model<MenuDocument>,

    @InjectModel(MenuCategory.name)
    private readonly categoryModel: Model<MenuCategoryDocument>,

    @InjectModel(MenuItem.name)
    private readonly itemModel: Model<MenuItemDocument>,
  ) {}

  // MENUS
  async createMenu(
    tenantId: string,
    restaurantId: string,
    branchId: string,
    dto: CreateMenuDto,
  ) {
    const existing = await this.menuModel.findOne({
      branchId,
      name: dto.name,
      deletedAt: null,
    });

    if (existing) {
      throw new ConflictException('Menu already exists in this branch');
    }

    if (dto.isDefault) {
      await this.menuModel.updateMany(
        {
          branchId,
          deletedAt: null,
        },
        {
          $set: {
            isDefault: false,
          },
        },
      );
    }

    const menu = await this.menuModel.create({
      tenantId,
      restaurantId,
      branchId,
      ...dto,
      status: MenuStatus.DRAFT,
      isActive: true,
    });

    return this.toSafeMenu(menu);
  }

  async findMenus(tenantId: string, branchId: string) {
    const menus = await this.menuModel
      .find({
        tenantId,
        branchId,
        deletedAt: null,
      })
      .sort({
        isDefault: -1,
        createdAt: -1,
      })
      .lean();

    return menus.map((menu) => this.toSafeMenu(menu));
  }

  async findMenuById(tenantId: string, menuId: string) {
    const menu = await this.menuModel
      .findOne({
        _id: menuId,
        tenantId,
        deletedAt: null,
      })
      .lean();

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return this.toSafeMenu(menu);
  }

  async updateMenu(
    tenantId: string,
    menuId: string,
    dto: UpdateMenuDto,
  ) {
    const menu = await this.menuModel.findOne({
      _id: menuId,
      tenantId,
      deletedAt: null,
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    if (dto.isDefault) {
      await this.menuModel.updateMany(
        {
          branchId: menu.branchId,
          _id: {
            $ne: menu._id,
          },
          deletedAt: null,
        },
        {
          $set: {
            isDefault: false,
          },
        },
      );
    }

    Object.assign(menu, dto);
    await menu.save();

    return this.toSafeMenu(menu);
  }

  async publishMenu(tenantId: string, menuId: string) {
    const menu = await this.menuModel.findOne({
      _id: menuId,
      tenantId,
      deletedAt: null,
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    menu.status = MenuStatus.ACTIVE;
    menu.isActive = true;
    menu.publishedAt = new Date();

    await menu.save();

    return this.toSafeMenu(menu);
  }

  // -------------------------
  // CATEGORIES
  // -------------------------

  async createCategory(
    tenantId: string,
    menuId: string,
    dto: CreateCategoryDto,
  ) {
    const menu = await this.menuModel.findOne({
      _id: menuId,
      tenantId,
      deletedAt: null,
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    const existing = await this.categoryModel.findOne({
      menuId,
      name: dto.name,
      deletedAt: null,
    });

    if (existing) {
      throw new ConflictException('Category already exists');
    }

    const category = await this.categoryModel.create({
      tenantId: menu.tenantId,
      restaurantId: menu.restaurantId,
      branchId: menu.branchId,
      menuId: menu._id,
      ...dto,
    });

    return category;
  }

  async updateCategory(
    tenantId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ) {
    const category = await this.categoryModel.findOne({
      _id: categoryId,
      tenantId,
      deletedAt: null,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, dto);
    await category.save();

    return category;
  }

  async findCategories(tenantId: string, menuId: string) {
    return this.categoryModel
      .find({
        tenantId,
        menuId,
        deletedAt: null,
      })
      .sort({
        sortOrder: 1,
      })
      .lean();
  }

  // ITEMS
  async createItem(
    tenantId: string,
    menuId: string,
    dto: CreateMenuItemDto,
  ) {
    const menu = await this.menuModel.findOne({
      _id: menuId,
      tenantId,
      deletedAt: null,
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    const category = await this.categoryModel.findOne({
      _id: dto.categoryId,
      tenantId,
      menuId: menu._id,
      deletedAt: null,
    });

    if (!category) {
      throw new NotFoundException('Category not found in this menu');
    }

    const item = await this.itemModel.create({
      tenantId: menu.tenantId,
      restaurantId: menu.restaurantId,
      branchId: menu.branchId,
      menuId: menu._id,
      ...dto,
      status: MenuItemStatus.AVAILABLE,
      isActive: true,
    });

    return this.toSafeItem(item);
  }

  async findItems(
    tenantId: string,
    menuId: string,
    query: MenuQueryDto,
  ) {
    const menu = await this.menuModel.findOne({
      _id: menuId,
      tenantId,
      deletedAt: null,
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    const {
      page = 1,
      limit = 20,
      ...filters
    } = query;

    const filter: Record<string, any> = {
      tenantId,
      menuId: menu._id,
      deletedAt: null,
    };

    if (filters.categoryId) {
      filter.categoryId = filters.categoryId;
    }

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

    if (filters.vegetarian !== undefined) {
      filter.isVegetarian = filters.vegetarian;
    }

    if (filters.vegan !== undefined) {
      filter.isVegan = filters.vegan;
    }

    if (filters.jain !== undefined) {
      filter.isJain = filters.jain;
    }

    if (filters.halal !== undefined) {
      filter.isHalal = filters.halal;
    }

    if (filters.featured !== undefined) {
      filter.isFeatured = filters.featured;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.itemModel
        .find(filter)
        .sort({
          isFeatured: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.itemModel.countDocuments(filter),
    ]);

    return {
      data: items.map((item) => this.toSafeItem(item)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateItem(
    tenantId: string,
    itemId: string,
    dto: UpdateMenuItemDto,
  ) {
    const item = await this.itemModel.findOne({
      _id: itemId,
      tenantId,
      deletedAt: null,
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    if (dto.categoryId) {
      const category = await this.categoryModel.findOne({
        _id: dto.categoryId,
        tenantId,
        branchId: item.branchId,
        menuId: item.menuId,
        deletedAt: null,
      });

      if (!category) {
        throw new NotFoundException('Target category not found');
      }
    }

    Object.assign(item, dto);
    await item.save();

    return this.toSafeItem(item);
  }

  async updateItemStatus(
    tenantId: string,
    itemId: string,
    dto: UpdateMenuItemStatusDto,
  ) {
    const item = await this.itemModel.findOne({
      _id: itemId,
      tenantId,
      deletedAt: null,
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    item.status = dto.status;
    await item.save();

    return this.toSafeItem(item);
  }

  async deleteItem(tenantId: string, itemId: string) {
    const item = await this.itemModel.findOne({
      _id: itemId,
      tenantId,
      deletedAt: null,
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    item.deletedAt = new Date();
    item.isActive = false;
    item.status = MenuItemStatus.HIDDEN;

    await item.save();

    return {
      message: 'Menu item deleted successfully',
    };
  }

  private toSafeMenu(menu: any) {
    return {
      id: menu._id,
      tenantId: menu.tenantId,
      restaurantId: menu.restaurantId,
      branchId: menu.branchId,
      name: menu.name,
      description: menu.description,
      status: menu.status,
      isDefault: menu.isDefault,
      isActive: menu.isActive,
      publishedAt: menu.publishedAt,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }

  private toSafeItem(item: any) {
    return {
      id: item._id,
      tenantId: item.tenantId,
      restaurantId: item.restaurantId,
      branchId: item.branchId,
      menuId: item.menuId,
      categoryId: item.categoryId,

      name: item.name,
      description: item.description,

      type: item.type,
      status: item.status,
      pricingType: item.pricingType,

      price: item.price,
      compareAtPrice: item.compareAtPrice,

      variants: item.variants,
      spiceLevel: item.spiceLevel,
      cuisineTypes: item.cuisineTypes,
      dietaryTags: item.dietaryTags,
      allergenIds: item.allergenIds,
      tags: item.tags,
      imageUrl: item.imageUrl,
      gallery: item.gallery,

      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isJain: item.isJain,
      isHalal: item.isHalal,

      isFeatured: item.isFeatured,
      isRecommended: item.isRecommended,

      preparationTimeMinutes: item.preparationTimeMinutes,
      calories: item.calories,

      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
