import { IsEnum } from 'class-validator';
import { DeliveryStatus } from '../delivery.types.js';

export class UpdateDeliveryStatusDto {
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;
}
