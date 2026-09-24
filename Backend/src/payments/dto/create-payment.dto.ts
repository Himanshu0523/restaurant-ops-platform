import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  PaymentGateway,
  PaymentMethod,
} from '../payments.types.js';

export class CreatePaymentDto {
  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @IsString()
  idempotencyKey: string;
}