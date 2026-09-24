import { IsOptional, IsString } from 'class-validator';

export class PublishDropDto {
  @IsOptional()
  @IsString()
  note?: string;
}
