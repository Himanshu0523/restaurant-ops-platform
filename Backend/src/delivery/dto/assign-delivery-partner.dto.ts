import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { DeliveryPartnerType } from '../delivery.types.js';

export class AssignDeliveryPartnerDto {
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(DeliveryPartnerType)
  type?: DeliveryPartnerType;
}
