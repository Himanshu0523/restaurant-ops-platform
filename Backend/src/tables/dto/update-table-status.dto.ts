import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TableStatus } from '../tables.types.js';

export class UpdateTableStatusDto {
  @IsEnum(TableStatus)
  status: TableStatus;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  reason?: string;
}