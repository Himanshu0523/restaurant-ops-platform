import {
  IsOptional,
  IsString,
} from 'class-validator';

export class ApplyCouponDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  note?: string;
}
