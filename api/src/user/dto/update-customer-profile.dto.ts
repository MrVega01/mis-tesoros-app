import { IsString, Matches, MinLength } from 'class-validator'

export class UpdateCustomerProfileDto {
  @IsString()
  @MinLength(1)
  firstName: string

  @IsString()
  @MinLength(1)
  lastName: string

  @IsString()
  @Matches(/^\+[1-9]\d{0,3}\s?\d{6,14}$/)
  contactNumber: string
}
