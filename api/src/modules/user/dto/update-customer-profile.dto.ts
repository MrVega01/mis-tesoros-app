import { IsString, Matches, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCustomerProfileDto {
  @ApiProperty({ example: 'Maria' })
  @IsString()
  @MinLength(1)
  firstName: string

  @ApiProperty({ example: 'Lopez' })
  @IsString()
  @MinLength(1)
  lastName: string

  @ApiProperty({ example: '+58 4121234567', description: 'E.164 format with optional space after country code' })
  @IsString()
  @Matches(/^\+[1-9]\d{0,3}\s?\d{6,14}$/)
  contactNumber: string
}
