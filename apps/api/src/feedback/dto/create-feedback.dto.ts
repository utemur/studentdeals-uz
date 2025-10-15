import { IsString, IsEmail, IsOptional, IsInt, Min, Max, Length } from 'class-validator';

export class CreateFeedbackDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsString({ message: 'Message must be a string' })
  @Length(5, 2000, { message: 'Message must be between 5 and 2000 characters' })
  message!: string;

  @IsOptional()
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating?: number;
}