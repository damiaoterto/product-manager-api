import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateProductDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(3, 150)
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(3, 250)
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @ApiProperty()
  @IsOptional()
  @IsDefined()
  @IsArray()
  categories?: string[];
}
