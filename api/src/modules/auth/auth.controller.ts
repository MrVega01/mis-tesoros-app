import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Creates an account and sends a 6-digit email verification code. Sellers must verify email before proceeding; customers receive tokens immediately.' })
  @ApiResponse({ status: 201, description: 'User registered. Sellers receive a verification code; customers receive JWT tokens.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.role)
  }

  @Public()
  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with a 6-digit code', description: 'Validates the code sent on registration and returns JWT access + refresh tokens.' })
  @ApiResponse({ status: 200, description: 'Email verified. Returns accessToken and refreshToken.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code.' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.email, dto.code)
  }

  @Public()
  @Post('resend-code')
  @ApiOperation({ summary: 'Resend a verification or password-reset code' })
  @ApiResponse({ status: 200, description: 'Code resent successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  resendCode(@Body() dto: ResendCodeDto) {
    return this.auth.resendCode(dto.email, dto.type)
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password', description: 'Returns JWT access and refresh tokens on success.' })
  @ApiResponse({ status: 200, description: 'Login successful. Returns accessToken and refreshToken.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password)
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token', description: 'Exchanges a valid refresh token for a new access token.' })
  @ApiResponse({ status: 200, description: 'Returns a new accessToken.' })
  @ApiResponse({ status: 401, description: 'Refresh token invalid or revoked.' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refresh(dto.refreshToken)
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, description: 'Refresh token revoked.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  logout(@Body() dto: LogoutDto, @CurrentUser() _user: any) {
    return this.auth.logout(dto.refreshToken)
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset code', description: 'Sends a 6-digit reset code to the provided email address.' })
  @ApiResponse({ status: 200, description: 'Reset code sent (always 200 to prevent email enumeration).' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email)
  }

  @Public()
  @Post('verify-reset-code')
  @ApiOperation({ summary: 'Validate a password reset code', description: 'Returns a short-lived resetToken used to authorize the reset-password call.' })
  @ApiResponse({ status: 200, description: 'Code valid. Returns resetToken.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code.' })
  verifyResetCode(@Body() dto: VerifyCodeDto) {
    return this.auth.verifyResetCode(dto.email, dto.code)
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Set a new password using the reset token' })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token.' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.resetToken, dto.password)
  }
}
