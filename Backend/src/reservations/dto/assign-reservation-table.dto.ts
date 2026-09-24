import { IsMongoId } from 'class-validator';

export class AssignReservationTableDto {
  @IsMongoId()
  tableId: string;
}
