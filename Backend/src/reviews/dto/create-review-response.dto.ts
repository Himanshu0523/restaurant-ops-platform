import {
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReviewResponseDto {
  @IsString()
  @MaxLength(3000)
  message: string;
}
