import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { BranchStatus } from '../branch.types.js';

export class UpdateBranchStatusDto {

  @IsEnum(BranchStatus)
  status: BranchStatus;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  reason?: string;

  @IsOptional()
  @IsBoolean()
  acceptingOrders?: boolean;

  @IsOptional()
  @IsBoolean()
  acceptingReservations?: boolean;

  @IsOptional()
  @IsBoolean()
  acceptingDelivery?: boolean;

  @IsOptional()
  @IsBoolean()
  acceptingTakeaway?: boolean;

  @IsOptional()
  estimatedWaitTimeMinutes?: number;
}