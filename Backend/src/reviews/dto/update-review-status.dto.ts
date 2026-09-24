import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReviewStatus } from '../review.types.js';

export class UpdateReviewStatusDto {
  @IsEnum(ReviewStatus)
  status: ReviewStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
