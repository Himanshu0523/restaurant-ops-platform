import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { OrderStatus } from '../order.types.js';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
