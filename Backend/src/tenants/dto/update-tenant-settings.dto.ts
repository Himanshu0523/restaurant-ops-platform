import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTenantSettingsDto {

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsBoolean()
  enableNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  enableAI?: boolean;

  @IsOptional()
  @IsBoolean()
  enableAnalytics?: boolean;

  @IsOptional()
  @IsBoolean()
  enableInventory?: boolean;

  @IsOptional()
  @IsBoolean()
  enableReservations?: boolean;

  @IsOptional()
  @IsBoolean()
  enableDelivery?: boolean;

  @IsOptional()
  @IsBoolean()
  enableCustomerReviews?: boolean;
}