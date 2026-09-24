import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  Branch,
  BranchDocument,
} from './schemas/branch.schema.js';

import {
  BranchStatus,
} from './branch.types.js';

import {
  CreateBranchDto ,
} from './dto/create-branch.dto.js';

import {
  UpdateBranchDto,
} from './dto/update-branch.dto.js';

import {
  UpdateBranchStatusDto,
} from './dto/update-branch-status.dto.js';

import {
  UpdateBranchLocationDto,
} from './dto/update-branch-location.dto.js';

import {
  UpdateBranchHoursDto,
} from './dto/update-branch-hours.dto.js';

@Injectable()
export class BranchesService {

  constructor(
    @InjectModel(Branch.name)
    private readonly branchModel:
      Model<BranchDocument>,
  ) {}

  async create(
    tenantId: string,
    restaurantId: string,
    dto: CreateBranchDto,
  ) {

    const existing =
      await this.branchModel.findOne({
        restaurantId,
        slug: dto.slug
          .trim()
          .toLowerCase(),
      });

    if (existing) {
      throw new ConflictException(
        'Branch slug already exists for this restaurant',
      );
    }

    const branch =
      new this.branchModel({
        ...dto,

        tenantId,

        restaurantId,

        slug: dto.slug
          .trim()
          .toLowerCase(),
      });

    const saved =
      await branch.save();

    return this.toSafeBranch(saved);
  }

  async findById(
    branchId: string,
  ): Promise<BranchDocument> {

    const branch =
      await this.branchModel.findById(
        branchId,
      );

    if (!branch) {
      throw new NotFoundException(
        'Branch not found',
      );
    }

    return branch;
  }

  async findByRestaurant(
    restaurantId: string,
  ) {

    const branches =
      await this.branchModel
        .find({
          restaurantId,
          deletedAt: null,
        })
        .sort({
          createdAt: -1,
        });

    return branches.map(
      branch =>
        this.toSafeBranch(branch),
    );
  }

  async update(
    branchId: string,
    dto: UpdateBranchDto,
  ) {

    const branch =
      await this.findById(branchId);

    Object.assign(
      branch,
      dto,
    );

    const updated =
      await branch.save();

    return this.toSafeBranch(
      updated,
    );
  }

  async updateStatus(
    branchId: string,
    dto: UpdateBranchStatusDto,
  ) {

    const branch =
      await this.findById(branchId);

    branch.status = dto.status;

    if (
      dto.acceptingOrders !== undefined
    ) {
      branch.settings.acceptingOrders =
        dto.acceptingOrders;
    }

    if (
      dto.acceptingReservations !== undefined
    ) {
      branch.settings.acceptingReservations =
        dto.acceptingReservations;
    }

    if (
      dto.acceptingDelivery !== undefined
    ) {
      branch.settings.acceptingDelivery =
        dto.acceptingDelivery;
    }

    if (
      dto.acceptingTakeaway !== undefined
    ) {
      branch.settings.acceptingTakeaway =
        dto.acceptingTakeaway;
    }

    const updated =
      await branch.save();

    return this.toSafeBranch(
      updated,
    );
  }

  async updateLocation(
    branchId: string,
    dto: UpdateBranchLocationDto,
  ) {

    const branch =
      await this.findById(branchId);

    if (dto.addressLine1 !== undefined) {
      branch.address.addressLine1 =
        dto.addressLine1;
    }

    if (dto.addressLine2 !== undefined) {
      branch.address.addressLine2 =
        dto.addressLine2;
    }

    if (dto.city !== undefined) {
      branch.address.city =
        dto.city;
    }

    if (dto.state !== undefined) {
      branch.address.state =
        dto.state;
    }

    if (dto.postalCode !== undefined) {
      branch.address.postalCode =
        dto.postalCode;
    }

    if (dto.latitude !== undefined) {
      branch.location.latitude =
        dto.latitude;
    }

    if (dto.longitude !== undefined) {
      branch.location.longitude =
        dto.longitude;
    }

    const updated =
      await branch.save();

    return this.toSafeBranch(
      updated,
    );
  }

  async updateHours(
    branchId: string,
    dto: UpdateBranchHoursDto,
  ) {

    const branch =
      await this.findById(branchId);

    branch.operatingHours =
      dto.days;

    const updated =
      await branch.save();

    return this.toSafeBranch(
      updated,
    );
  }

  async softDelete(
    branchId: string,
  ) {

    const branch =
      await this.findById(branchId);

    branch.status =
      BranchStatus.PERMANENTLY_CLOSED;

    branch.deletedAt =
      new Date();

    await branch.save();

    return {
      success: true,
    };
  }

  toSafeBranch(
    branch: BranchDocument,
  ) {

    return {
      id: branch._id.toString(),

      tenantId:
        branch.tenantId.toString(),

      restaurantId:
        branch.restaurantId.toString(),

      name: branch.name,

      slug: branch.slug,

      description:
        branch.description,

      type: branch.type,

      status: branch.status,

      address: branch.address,

      location: branch.location,

      phone: branch.phone,

      email: branch.email,

      managerId:
        branch.managerId
          ? branch.managerId.toString()
          : undefined,

      totalTables:
        branch.totalTables,

      totalSeats:
        branch.totalSeats,

      settings:
        branch.settings,

      createdAt:
        branch.createdAt,

      updatedAt:
        branch.updatedAt,
    };
  }
}