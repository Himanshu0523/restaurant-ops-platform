import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant, TenantDocument } from './schemas/tenant.schema.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { UserService } from '../user/user.service.js';
import { Role } from '../user/user.types.js';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<TenantDocument>,
    private readonly userService: UserService,
  ) {}

  async create(ownerId: string, dto: CreateTenantDto) {
    const existing = await this.tenantModel
      .findOne({ ownerId: new Types.ObjectId(ownerId), deletedAt: null })
      .exec();
    if (existing) {
      throw new ConflictException('This account already owns a tenant');
    }

    const slug = dto.slug ?? this.slugify(dto.name);

    try {
      const tenant = await this.tenantModel.create({
        name: dto.name,
        slug,
        ownerId: new Types.ObjectId(ownerId),
      });

      await this.userService.setTenantAndRole(
        ownerId,
        tenant._id.toString(),
        Role.OWNER,
      );

      return tenant.toObject();
    } catch (err) {
      const e = err as { code?: number };
      if (e.code === 11000) {
        throw new ConflictException('A tenant with this slug already exists');
      }
      throw err;
    }
  }

  async findMine(ownerId: string) {
    const tenant = await this.tenantModel
      .findOne({ ownerId: new Types.ObjectId(ownerId), deletedAt: null })
      .exec();
    if (!tenant) {
      throw new NotFoundException('No tenant found for this account');
    }
    return tenant.toObject();
  }

  async updateMine(ownerId: string, dto: UpdateTenantDto) {
    const tenant = await this.tenantModel
      .findOneAndUpdate(
        { ownerId: new Types.ObjectId(ownerId), deletedAt: null },
        { $set: dto },
        { new: true },
      )
      .exec();
    if (!tenant) {
      throw new NotFoundException('No tenant found for this account');
    }
    return tenant.toObject();
  }

  async softDeleteMine(ownerId: string) {
    const tenant = await this.tenantModel
      .findOneAndUpdate(
        { ownerId: new Types.ObjectId(ownerId), deletedAt: null },
        { $set: { deletedAt: new Date() } },
        { new: true },
      )
      .exec();
    if (!tenant) {
      throw new NotFoundException('No tenant found for this account');
    }
    return { message: 'Tenant deleted successfully' };
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