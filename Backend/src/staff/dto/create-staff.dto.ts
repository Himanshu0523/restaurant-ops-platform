import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  StaffDepartment,
  StaffType,
} from '../staff.types.js';

class StaffContactDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;
}

class StaffScheduleDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(168)
  weeklyHours?: number;

  @IsOptional()
  flexibleSchedule?: boolean;
}

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  employeeCode: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  position: string;

  @IsOptional()
  @IsEnum(StaffType)
  type?: StaffType;

  @IsOptional()
  @IsEnum(StaffDepartment)
  department?: StaffDepartment;

  @IsOptional()
  @ValidateNested()
  @Type(() => StaffContactDto)
  contact?: StaffContactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => StaffScheduleDto)
  schedule?: StaffScheduleDto;

  @IsOptional()
  @IsDateString()
  joinedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}