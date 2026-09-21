import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export enum DietPreference {
  VEG = 'Veg',
  NON_VEG = 'Non-Veg',
  JAIN = 'Jain',
  VEGAN = 'Vegan',
  HALAL = 'Halal',
}

export class UpdatePreferencesDto {
  @IsOptional()
  @IsEnum(DietPreference)
  diet?: DietPreference;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  theme?: string;
}
