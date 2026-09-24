import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import {
  Model,
  Types,
} from 'mongoose';

import {
  Staff,
  StaffDocument,
} from './schemas/staff.schema.js';

import {
  StaffStatus,
} from './staff.types.js';

import {
  CreateStaffDto,
} from './dto/create-staff.dto.js';

import {
  UpdateStaffDto,
} from './dto/update-staff.dto.js';

import {
  UpdateStaffStatusDto,
} from './dto/update-staff-status.dto.js';

import {
  AssignStaffDto,
} from './dto/assign-staff.dto.js';

import {
  StaffQueryDto,
} from './dto/staff-query.dto.js';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name)
    private readonly staffModel: Model<StaffDocument>,
  ) {}

  async create(
    tenantId: string,
    restaurantId: string,
    branchId: string,
    dto: CreateStaffDto,
  ) {
    const existing = await this.staffModel.findOne({
      tenantId,
      branchId,
      userId: dto.userId,
      deletedAt: null,
    });

    if (existing) {
      throw new ConflictException(
        'This user is already assigned to this branch',
      );
    }

    const employeeCodeExists =
      await this.staffModel.findOne({
        tenantId,
        branchId,
        employeeCode: dto.employeeCode,
        deletedAt: null,
      });

    if (employeeCodeExists) {
      throw new ConflictException(
        'Employee code already exists in this branch',
      );
    }

    const staff = await this.staffModel.create({
      tenantId,
      restaurantId,
      branchId,

      userId: dto.userId,

      employeeCode: dto.employeeCode,
      position: dto.position,

      type: dto.type,
      department: dto.department,

      contact: dto.contact,
      schedule: dto.schedule,

      joinedAt: dto.joinedAt
        ? new Date(dto.joinedAt)
        : new Date(),

      notes: dto.notes,

      status: StaffStatus.ACTIVE,
      isActive: true,
    });

    return this.toSafeStaff(staff);
  }

  async findById(
    tenantId: string,
    staffId: string,
  ) {
    const staff = await this.staffModel
      .findOne({
        _id: staffId,
        tenantId,
        deletedAt: null,
      })
      .lean();

    if (!staff) {
      throw new NotFoundException(
        'Staff member not found',
      );
    }

    return this.toSafeStaff(staff);
  }

  async findByBranch(
    tenantId: string,
    branchId: string,
    query: StaffQueryDto,
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

    if (filters.department) {
      filter.department = filters.department;
    }

    if (filters.isActive !== undefined) {
      filter.isActive = filters.isActive;
    }

    if (filters.search) {
      filter.$or = [
        {
          employeeCode: {
            $regex: filters.search,
            $options: 'i',
          },
        },
        {
          position: {
            $regex: filters.search,
            $options: 'i',
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [staff, total] =
      await Promise.all([
        this.staffModel
          .find(filter)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        this.staffModel.countDocuments(filter),
      ]);

    return {
      data: staff.map((item) =>
        this.toSafeStaff(item),
      ),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  async update(
    tenantId: string,
    staffId: string,
    dto: UpdateStaffDto,
  ) {
    const staff =
      await this.staffModel.findOne({
        _id: staffId,
        tenantId,
        deletedAt: null,
      });

    if (!staff) {
      throw new NotFoundException(
        'Staff member not found',
      );
    }

    if (
      dto.employeeCode &&
      dto.employeeCode !== staff.employeeCode
    ) {
      const duplicate =
        await this.staffModel.findOne({
          tenantId,
          branchId: staff.branchId,
          employeeCode: dto.employeeCode,
          deletedAt: null,
          _id: {
            $ne: staff._id,
          },
        });

      if (duplicate) {
        throw new ConflictException(
          'Employee code already exists',
        );
      }
    }

    Object.assign(staff, dto);

    if (dto.joinedAt) {
      staff.joinedAt = new Date(
        dto.joinedAt,
      );
    }

    await staff.save();

    return this.toSafeStaff(staff);
  }

  async updateStatus(
    tenantId: string,
    staffId: string,
    dto: UpdateStaffStatusDto,
  ) {
    const staff =
      await this.staffModel.findOne({
        _id: staffId,
        tenantId,
        deletedAt: null,
      });

    if (!staff) {
      throw new NotFoundException(
        'Staff member not found',
      );
    }

    const previousStatus =
      staff.status;

    staff.status = dto.status;

    if (
      dto.status ===
      StaffStatus.TERMINATED
    ) {
      staff.isActive = false;
      staff.terminatedAt =
        new Date();
    }

    if (
      dto.status ===
      StaffStatus.ACTIVE
    ) {
      staff.isActive = true;
      staff.terminatedAt =
        undefined;
    }

    await staff.save();

    return {
      staff: this.toSafeStaff(staff),

      transition: {
        from: previousStatus,
        to: dto.status,
      },

      reason: dto.reason,
    };
  }

  async assign(
    tenantId: string,
    staffId: string,
    dto: AssignStaffDto,
  ) {
    const staff =
      await this.staffModel.findOne({
        _id: staffId,
        tenantId,
        deletedAt: null,
      });

    if (!staff) {
      throw new NotFoundException(
        'Staff member not found',
      );
    }

    if (
      staff.branchId.toString() ===
      dto.branchId
    ) {
      throw new BadRequestException(
        'Staff member is already assigned to this branch',
      );
    }

    const duplicate =
      await this.staffModel.findOne({
        tenantId,
        branchId: dto.branchId,
        userId: staff.userId,
        deletedAt: null,
      });

    if (duplicate) {
      throw new ConflictException(
        'User is already staff at the destination branch',
      );
    }

    const previousBranchId =
      staff.branchId;

    staff.branchId =
      new Types.ObjectId(
        dto.branchId,
      );

    if (dto.position) {
      staff.position =
        dto.position;
    }

    await staff.save();

    return {
      staff: this.toSafeStaff(staff),

      previousBranchId,
      newBranchId: staff.branchId,
    };
  }

  async softDelete(
    tenantId: string,
    staffId: string,
  ) {
    const staff =
      await this.staffModel.findOne({
        _id: staffId,
        tenantId,
        deletedAt: null,
      });

    if (!staff) {
      throw new NotFoundException(
        'Staff member not found',
      );
    }

    staff.deletedAt =
      new Date();

    staff.isActive = false;
    staff.status =
      StaffStatus.INACTIVE;

    await staff.save();

    return {
      message:
        'Staff member removed successfully',
    };
  }

  private toSafeStaff(
    staff: any,
  ) {
    return {
      id: staff._id,

      tenantId: staff.tenantId,
      userId: staff.userId,

      restaurantId:
        staff.restaurantId,

      branchId:
        staff.branchId,

      employeeCode:
        staff.employeeCode,

      position:
        staff.position,

      type:
        staff.type,

      department:
        staff.department,

      status:
        staff.status,

      contact:
        staff.contact,

      schedule:
        staff.schedule,

      joinedAt:
        staff.joinedAt,

      terminatedAt:
        staff.terminatedAt,

      notes:
        staff.notes,

      isActive:
        staff.isActive,

      createdAt:
        staff.createdAt,

      updatedAt:
        staff.updatedAt,
    };
  }
}