import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateProductDto {
  @ApiProperty({ example: 'Collar de perlas' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string

  @ApiProperty({ example: 12.5, description: 'Price in USD, up to 2 decimals' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number

  @ApiPropertyOptional({ example: 10, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number

  @ApiPropertyOptional({
    example: 'a3f1c2d4-5b6e-4f7a-8b9c-0d1e2f3a4b5c',
    nullable: true,
    description:
      'Id of a category owned by the seller. Null leaves the product uncategorized.'
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null
}
