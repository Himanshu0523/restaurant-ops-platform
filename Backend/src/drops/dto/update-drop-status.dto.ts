import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { DropStatus } from '../drop.types.js';

export class UpdateDropStatusDto {
  @IsEnum(DropStatus)
  status: DropStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
