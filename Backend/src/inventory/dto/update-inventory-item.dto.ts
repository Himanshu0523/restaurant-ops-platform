import {
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateInventoryItemDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderQuantity?: number;
}
