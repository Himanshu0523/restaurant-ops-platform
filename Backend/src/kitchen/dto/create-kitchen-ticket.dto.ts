import {
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateKitchenTicketDto {
  @IsMongoId()
  orderId: string;

  @IsOptional()
  @IsString()
  customerNote?: string;
}
