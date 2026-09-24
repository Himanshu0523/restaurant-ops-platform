import { IsOptional, IsString } from 'class-validator';

export class MarkDeliveredDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
