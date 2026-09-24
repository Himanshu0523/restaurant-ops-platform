import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Tenant,
  TenantDocument,
} from './schemas/tenant.schema.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { UpdateTenantSettingsDto } from './dto/update-tenant-settings.dto.js';
import { TenantStatus } from './tenant.types.js';
import { UserService } from '../user/user.service.js';
import { UserRole } from '../user/user.types.js';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<TenantDocument>,
    private readonly userService: UserService,
  ) {}

  async create(ownerId: string, dto: CreateTenantDto) {
    const slug = (dto.slug ?? dto.name.toLowerCase().replace(/[^a-z0-9]/g, '-'))
      .trim()
      .toLowerCase();

    const existing = await this.tenantModel
      .findOne({ slug })
      .lean();

    if (existing) {
      throw new ConflictException('Tenant slug already exists');
    }

    const tenant = new this.tenantModel({
      ...dto,
      slug,
      ownerId: new Types.ObjectId(ownerId),
    });

    const saved = await tenant.save();

    // Assign owner role and tenantId to user
    await this.userService.setTenantAndRole(
      ownerId,
      saved._id.toString(),
      UserRole.OWNER,
    );

    return this.toSafeTenant(saved);
  }

  async findById(tenantId: string): Promise<TenantDocument> {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async findActive(tenantId: string): Promise<TenantDocument> {
    const tenant = await this.tenantModel.findOne({
      _id: tenantId,
      status: TenantStatus.ACTIVE,
    });

    if (!tenant) {
      throw new NotFoundException('Active tenant not found');
    }

    return tenant;
  }

  async update(tenantId: string, dto: UpdateTenantDto) {
    const tenant = await this.findById(tenantId);
    Object.assign(tenant, dto);
    const updated = await tenant.save();
    return this.toSafeTenant(updated);
  }

  async updateSettings(tenantId: string, dto: UpdateTenantSettingsDto) {
    const tenant = await this.findById(tenantId);
    Object.assign(tenant.settings, dto);
    const updated = await tenant.save();
    return this.toSafeTenant(updated);
  }

  async suspend(tenantId: string) {
    const tenant = await this.findById(tenantId);
    tenant.status = TenantStatus.SUSPENDED;
    await tenant.save();
    return this.toSafeTenant(tenant);
  }

  async activate(tenantId: string) {
    const tenant = await this.findById(tenantId);
    tenant.status = TenantStatus.ACTIVE;
    await tenant.save();
    return this.toSafeTenant(tenant);
  }

  async findByOwner(ownerId: string) {
    const tenants = await this.tenantModel
      .find({
        ownerId: new Types.ObjectId(ownerId),
        status: { $ne: TenantStatus.DELETED },
      })
      .sort({ createdAt: -1 });

    return tenants.map((tenant) => this.toSafeTenant(tenant));
  }

  toSafeTenant(tenant: TenantDocument) {
    return {
      id: tenant._id.toString(),
      name: tenant.name,
      slug: tenant.slug,
      description: tenant.description,
      status: tenant.status,
      plan: tenant.plan,
      ownerId: tenant.ownerId.toString(),
      email: tenant.email,
      phone: tenant.phone,
      settings: {
        currency: tenant.settings?.currency ?? 'INR',
        timezone: tenant.settings?.timezone ?? 'Asia/Kolkata',
        locale: tenant.settings?.locale ?? 'en-IN',
        enableNotifications: tenant.settings?.enableNotifications ?? true,
        enableAI: tenant.settings?.enableAI ?? true,
        enableAnalytics: tenant.settings?.enableAnalytics ?? true,
        enableInventory: tenant.settings?.enableInventory ?? true,
        enableReservations: tenant.settings?.enableReservations ?? true,
        enableDelivery: tenant.settings?.enableDelivery ?? true,
        enableCustomerReviews: tenant.settings?.enableCustomerReviews ?? true,
      },
      createdAt: (tenant as any).createdAt,
      updatedAt: (tenant as any).updatedAt,
    };
  }
}