import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token issued on login or verify-email' })
  @IsString()
  refreshToken: string
}
