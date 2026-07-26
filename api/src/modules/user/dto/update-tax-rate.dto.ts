import { IsNumber, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateTaxRateDto {
  @ApiProperty({
    example: 36.5,
    description: 'USD → bolívar rate this seller prices with, up to 2 decimals'
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  customTaxRate: number
}
