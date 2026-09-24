import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  KitchenTicketStatus,
} from '../kitchen.types.js';

export class UpdateTicketStatusDto {
  @IsEnum(KitchenTicketStatus)
  status: KitchenTicketStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
