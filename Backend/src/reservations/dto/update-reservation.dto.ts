import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  guestCount?: number;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(360)
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
