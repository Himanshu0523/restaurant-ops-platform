import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  KitchenPriority,
  KitchenTicketStatus,
} from '../kitchen.types.js';

export class KitchenQueryDto {
  @IsOptional()
  @IsEnum(KitchenTicketStatus)
  status?: KitchenTicketStatus;

  @IsOptional()
  @IsEnum(KitchenPriority)
  priority?: KitchenPriority;

  @IsOptional()
  @IsString()
  station?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
