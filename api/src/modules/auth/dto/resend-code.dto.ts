import { IsEmail, IsEnum } from 'class-validator'
import { VerificationCodeType } from '@prisma/client'

export class ResendCodeDto {
  @IsEmail()
  email: string

  @IsEnum(VerificationCodeType)
  type: VerificationCodeType
}
