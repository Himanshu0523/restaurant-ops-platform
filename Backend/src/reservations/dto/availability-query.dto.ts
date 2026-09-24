import {
  IsDateString,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class AvailabilityQueryDto {
  @IsDateString()
  startAt: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(360)
  durationMinutes?: number;

  @IsInt()
  @Min(1)
  @Max(50)
  guestCount: number;
}
