import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TableShape,
  TableType,
} from '../tables.types.js';

class TablePositionDto {
  @IsOptional()
  @IsNumber()
  x?: number;

  @IsOptional()
  @IsNumber()
  y?: number;

  @IsOptional()
  @IsNumber()
  rotation?: number;
}

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tableNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(TableType)
  type?: TableType;

  @IsOptional()
  @IsEnum(TableShape)
  shape?: TableShape;

  @IsInt()
  @Min(1)
  @Max(50)
  capacity: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  minCapacity?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  maxCapacity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  floor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  zone?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TablePositionDto)
  position?: TablePositionDto;

  @IsOptional()
  @IsString()
  qrCodeToken?: string;
}