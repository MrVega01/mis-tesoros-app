import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty({ enum: UserRole, example: UserRole.SELLER })
  @IsEnum(UserRole)
  role: UserRole
}
