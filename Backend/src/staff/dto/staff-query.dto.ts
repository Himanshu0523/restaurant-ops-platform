import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  StaffDepartment,
  StaffStatus,
  StaffType,
} from '../staff.types.js';

export class StaffQueryDto {
    @IsOptional()
    @IsEnum(StaffStatus)
    status?: StaffStatus;

    @IsOptional()
    @IsEnum(StaffType)
    type?: StaffType;

    @IsOptional()
    @IsEnum(StaffDepartment)
    department?: StaffDepartment;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    branchId?: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
}