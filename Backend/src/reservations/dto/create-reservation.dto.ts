import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  ReservationSource,
  ReservationTablePreference,
} from '../reservation.types.js';

export class CreateReservationDto {
  @IsInt()
  @Min(1)
  @Max(50)
  guestCount: number;

  @IsDateString()
  startAt: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(360)
  durationMinutes?: number;

  @IsOptional()
  @IsEnum(ReservationSource)
  source?: ReservationSource;

  @IsOptional()
  @IsMongoId()
  tableId?: string;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsPhoneNumber()
  guestPhone?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(ReservationTablePreference, { each: true })
  preferences?: ReservationTablePreference[];

  @IsOptional()
  @IsString()
  specialRequests?: string;
}
