import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class OperatingDayDto {

  @IsString()
  day: string;

  @IsBoolean()
  isOpen: boolean;

  @IsOptional()
  @IsString()
  openingTime?: string;

  @IsOptional()
  @IsString()
  closingTime?: string;
}

export class UpdateBranchHoursDto {

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingDayDto)
  days: OperatingDayDto[];
}