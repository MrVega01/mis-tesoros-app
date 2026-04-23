import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { Public } from '@common/decorators/public.decorator'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
import { ResendCodeDto } from './dto/resend-code.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { VerifyCodeDto } from './dto/verify-code.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { LogoutDto } from './dto/logout.dto'

@Controller('auth')
export class AuthController {
  constructor (private auth: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('register')
  register (@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.role)
  }

  @Public()
  @Post('verify-email')
  verifyEmail (@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.email, dto.code)
  }

  @Public()
  @Post('resend-code')
  resendCode (@Body() dto: ResendCodeDto) {
    return this.auth.resendCode(dto.email, dto.type)
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('login')
  login (@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password)
  }

  @Public()
  @Post('refresh')
  refresh (@Body() dto: RefreshTokenDto) {
    return this.auth.refresh(dto.refreshToken)
  }

  @Post('logout')
  logout (@Body() dto: LogoutDto, @CurrentUser() _user: any) {
    return this.auth.logout(dto.refreshToken)
  }

  @Public()
  @Post('forgot-password')
  forgotPassword (@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email)
  }

  @Public()
  @Post('verify-reset-code')
  verifyResetCode (@Body() dto: VerifyCodeDto) {
    return this.auth.verifyResetCode(dto.email, dto.code)
  }

  @Public()
  @Post('reset-password')
  resetPassword (@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.resetToken, dto.password)
  }
}
