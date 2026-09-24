import {
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsMongoId()
  tableId?: string;

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  deliveryAddress?: Record<string, unknown>;
}
