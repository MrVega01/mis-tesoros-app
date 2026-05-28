import { IsEmail, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { VerificationCodeType } from '@prisma/client'

export class ResendCodeDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ enum: VerificationCodeType, example: VerificationCodeType.EMAIL_CONFIRMATION })
  @IsEnum(VerificationCodeType)
  type: VerificationCodeType
}
