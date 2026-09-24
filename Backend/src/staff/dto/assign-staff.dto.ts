import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AssignStaffDto {
    @IsNotEmpty()
    @IsString()
    branchId: string;

    @IsOptional()
    @IsString()
    position?: string;
}