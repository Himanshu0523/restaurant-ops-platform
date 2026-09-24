import { IsMongoId } from 'class-validator';

export class AssignTicketStaffDto {
  @IsMongoId()
  staffId: string;
}
