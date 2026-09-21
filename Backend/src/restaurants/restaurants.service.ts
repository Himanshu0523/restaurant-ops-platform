import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurants.schema.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { RestaurantQueryDto } from './dto/restaurant-query.dto.js';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(
    tenantId: string | null | undefined,
    ownerId: string,
    dto: CreateRestaurantDto,
  ) {
    if (!tenantId) {
      throw new ForbiddenException(
        'You must own a tenant before creating a restaurant',
      );
    }

    const slug = dto.slug ?? this.slugify(dto.name);

    try {
      const restaurant = await this.restaurantModel.create({
        ...dto,
        slug,
        tenantId: new Types.ObjectId(tenantId),
        ownerId: new Types.ObjectId(ownerId),
      });
      return restaurant.toObject();
    } catch (err) {
      const e = err as { code?: number };
      if (e.code === 11000) {
        throw new ConflictException(
          'A restaurant with this slug already exists in your tenant',
        );
      }
      throw err;
    }
  }

  async findAllForTenant(tenantId: string | null | undefined, query: RestaurantQueryDto) {
    if (!tenantId) {
      return { data: [], total: 0, page: 1, limit: 20 };
    }

    const filter: Record<string, any> = {
      tenantId: new Types.ObjectId(tenantId),
      deletedAt: null,
    };

    if (query.search) {
      filter.$text = { $search: query.search };
    }
    if (query.cuisine) {
      filter.cuisineTypes = query.cuisine;
    }
    if (query.type) filter.type = query.type;
    if (query.priceRange) filter.priceRange = query.priceRange;
    if (query.status) filter.status = query.status;
    if (typeof query.acceptsDelivery === 'boolean') {
      filter.acceptsDelivery = query.acceptsDelivery;
    }
    if (typeof query.acceptsReservations === 'boolean') {
      filter.acceptsReservations = query.acceptsReservations;
    }
    if (typeof query.acceptsDineIn === 'boolean') {
      filter.acceptsDineIn = query.acceptsDineIn;
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.restaurantModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.restaurantModel.countDocuments(filter).exec(),
    ]);

    return {
      data: data.map((r) => r.toObject()),
      total,
      page,
      limit,
    };
  }

  async findOne(tenantId: string | null | undefined, id: string) {
    if (!tenantId) {
      throw new NotFoundException('Restaurant not found');
    }

    const restaurant = await this.restaurantModel
      .findOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
        deletedAt: null,
      })
      .exec();

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant.toObject();
  }

  async update(tenantId: string | null | undefined, id: string, dto: UpdateRestaurantDto) {
    if (!tenantId) {
      throw new NotFoundException('Restaurant not found');
    }

    const restaurant = await this.restaurantModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
          deletedAt: null,
        },
        { $set: dto },
        { new: true },
      )
      .exec();

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant.toObject();
  }

  async softDelete(tenantId: string | null | undefined, id: string) {
    if (!tenantId) {
      throw new NotFoundException('Restaurant not found');
    }

    const restaurant = await this.restaurantModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
          deletedAt: null,
        },
        { $set: { deletedAt: new Date() } },
        { new: true },
      )
      .exec();

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return { message: 'Restaurant deleted successfully' };
  }

  private slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}