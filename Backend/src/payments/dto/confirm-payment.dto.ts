import { IsOptional, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @IsOptional()
  @IsString()
  gatewayPaymentId?: string;

  @IsOptional()
  @IsString()
  gatewaySignature?: string;
}