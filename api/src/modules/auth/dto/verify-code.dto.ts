import { IsEmail, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyCodeDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '748291', minLength: 6, maxLength: 6 })
  @IsString()
  @Length(6, 6)
  code: string
}
