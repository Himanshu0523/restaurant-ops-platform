import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { OrderType } from '../order.types.js';

export class CreateOrderItemInput {
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

export class CreateOrderDto {
  @IsEnum(OrderType)
  type: OrderType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemInput)
  items: CreateOrderItemInput[];

  @IsOptional()
  @IsMongoId()
  tableId?: string;

  @IsOptional()
  @IsMongoId()
  reservationId?: string;

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  deliveryAddress?: Record<string, unknown>;
}
