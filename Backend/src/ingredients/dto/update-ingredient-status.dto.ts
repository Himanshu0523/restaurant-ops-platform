import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { IngredientStatus } from '../ingredient.types.js';

export class UpdateIngredientStatusDto {
  @IsEnum(IngredientStatus)
  status: IngredientStatus;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  reason?: string;
}
