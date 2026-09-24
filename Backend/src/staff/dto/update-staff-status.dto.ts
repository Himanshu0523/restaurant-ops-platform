import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { StaffStatus } from '../staff.types.js';

export class UpdateStaffStatusDto {
    @IsEnum(StaffStatus)
    status: StaffStatus;

    @IsOptional()
    @IsString()
    @MaxLength(300)
    reason?: string;
}