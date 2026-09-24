import { IsMongoId, IsOptional } from 'class-validator';

export class CheckInReservationDto {
  @IsOptional()
  @IsMongoId()
  tableId?: string;
}
