import {
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class WebhookPaymentDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsObject()
  payload: Record<string, unknown>;
}
