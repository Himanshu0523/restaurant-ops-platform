import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { ReviewTargetType } from '../review.types.js';

export class CreateReviewDto {
  @IsEnum(ReviewTargetType)
  targetType: ReviewTargetType;

  @IsOptional()
  @IsMongoId()
  menuItemId?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  overall: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  food?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  service?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ambience?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  value?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  delivery?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
