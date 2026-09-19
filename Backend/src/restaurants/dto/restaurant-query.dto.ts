import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PriceRange, RestaurantStatus, RestaurantType } from '../restaurant.types.js';

export class RestaurantQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  cuisine?: string;

  @IsOptional()
  @IsEnum(RestaurantType)
  type?: RestaurantType;

  @IsOptional()
  @IsEnum(PriceRange)
  priceRange?: PriceRange;

  @IsOptional()
  @IsEnum(RestaurantStatus)
  status?: RestaurantStatus;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  acceptsDelivery?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  acceptsReservations?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  acceptsDineIn?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}