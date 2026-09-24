import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

import { KitchenPriority } from '../kitchen.types.js';

export class UpdateKitchenTicketDto {
  @IsOptional()
  @IsEnum(KitchenPriority)
  priority?: KitchenPriority;

  @IsOptional()
  @IsMongoId()
  assignedStaffId?: string;

  @IsOptional()
  @IsString()
  customerNote?: string;
}
