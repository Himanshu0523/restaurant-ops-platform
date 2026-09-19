import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { PriceRange, RestaurantType } from '../restaurant.types.js';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  name: string;

  @IsOptional()
  @IsString()
  @Length(2, 160)
  legalName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  slug?: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  description?: string;

  @IsEnum(RestaurantType)
  type: RestaurantType;

  @IsEnum(PriceRange)
  priceRange: PriceRange;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  gallery?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisineTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @IsOptional()
  @IsBoolean()
  acceptsDineIn?: boolean;

  @IsOptional()
  @IsBoolean()
  acceptsTakeaway?: boolean;

  @IsOptional()
  @IsBoolean()
  acceptsDelivery?: boolean;

  @IsOptional()
  @IsBoolean()
  acceptsReservations?: boolean;

  @IsOptional()
  @IsBoolean()
  acceptsPreOrders?: boolean;

  @IsOptional()
  @IsString()
  taxIdentificationNumber?: string;

  @IsOptional()
  @IsString()
  businessRegistrationNumber?: string;

  @IsOptional()
  @IsString()
  foodLicenseNumber?: string;
}