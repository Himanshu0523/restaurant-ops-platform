import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';

import {
  Allergen,
  DietaryPreference,
} from '../user.types.js';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(DietaryPreference, { each: true })
  dietaryPreferences?: DietaryPreference[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(Allergen, { each: true })
  excludedAllergens?: Allergen[];
}