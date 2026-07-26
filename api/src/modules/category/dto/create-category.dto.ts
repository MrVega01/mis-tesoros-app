import { IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({ example: 'Artesanía' })
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  name: string
}
