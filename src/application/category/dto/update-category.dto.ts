import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(3, 80)
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(3, 150)
  displayName?: string;
}
