import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProduct {
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @Length(3, 150)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @Length(3, 250)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsArray()
  categories: string[];
}
