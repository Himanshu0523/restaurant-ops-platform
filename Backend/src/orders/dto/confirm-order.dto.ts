import {
  IsOptional,
  IsString,
} from 'class-validator';

export class ConfirmOrderDto {
  @IsOptional()
  @IsString()
  note?: string;
}
