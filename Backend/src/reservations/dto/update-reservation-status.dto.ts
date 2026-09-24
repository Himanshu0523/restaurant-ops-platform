import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../reservation.types.js';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
