import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TransferStockDto {
  @IsMongoId()
  sourceBranchId: string;

  @IsMongoId()
  destinationBranchId: string;

  @IsMongoId()
  ingredientId: string;

  @IsNumber()
  @Min(0.000001)
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
