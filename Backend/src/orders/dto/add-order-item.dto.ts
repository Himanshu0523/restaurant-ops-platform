import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AddOrderItemDto {
  @IsMongoId()
  menuItemId: string;

  @IsOptional()
  @IsMongoId()
  dropId?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

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
