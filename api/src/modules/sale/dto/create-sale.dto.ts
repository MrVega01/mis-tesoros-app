import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class SaleItemDto {
  @ApiProperty({ example: 'a3f1c2d4-5b6e-4f7a-8b9c-0d1e2f3a4b5c' })
  @IsUUID()
  productId: string

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number
}

export class CreateSaleDto {
  @ApiProperty({
    type: [SaleItemDto],
    description:
      'Products sold. The same productId may appear more than once; the quantities are summed.'
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[]
}
