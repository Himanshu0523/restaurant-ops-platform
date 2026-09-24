import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  InventoryStatus,
} from '../inventory.types.js';

export class UpdateInventoryStatusDto {
  @IsEnum(InventoryStatus)
  status: InventoryStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
