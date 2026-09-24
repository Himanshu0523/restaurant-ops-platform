import { IsOptional, IsString } from 'class-validator';

export class MarkPickupDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
