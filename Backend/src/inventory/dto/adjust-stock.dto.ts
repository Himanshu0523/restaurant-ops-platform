import {
  IsNumber,
  IsString,
} from 'class-validator';

export class AdjustStockDto {
  @IsNumber()
  quantity: number;

  @IsString()
  reason: string;
}
