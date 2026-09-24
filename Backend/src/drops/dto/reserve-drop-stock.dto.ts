import {
  IsMongoId,
  IsNumber,
  Min,
} from 'class-validator';

export class ReserveDropStockDto {
    @IsNumber()
    @Min(1)
    quantity: number;

    @IsMongoId()
    orderId: string;
}
