import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DeliveryFailureReason } from '../delivery.types.js';

export class RecordDeliveryFailureDto {
  @IsEnum(DeliveryFailureReason)
  reason: DeliveryFailureReason;

  @IsOptional()
  @IsString()
  notes?: string;
}
