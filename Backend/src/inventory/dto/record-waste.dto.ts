import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RecordWasteDto {
  @IsNumber()
  @Min(0.000001)
  quantity: number;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  batchNumber?: string;
}
