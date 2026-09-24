import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateOrderItemDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsArray()
  variants?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addons?: string[];

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
