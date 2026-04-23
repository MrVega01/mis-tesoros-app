import { IsEmail, IsEnum } from 'class-validator'
import { VerificationCodeType } from '@generated/prisma/client'

export class ResendCodeDto {
  @IsEmail()
  email: string

  @IsEnum(VerificationCodeType)
  type: VerificationCodeType
}
