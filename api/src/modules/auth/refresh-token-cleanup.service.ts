import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '@core/prisma/prisma.service'

@Injectable()
export class RefreshTokenCleanupService {
  private readonly logger = new Logger(RefreshTokenCleanupService.name)

  constructor(private prisma: PrismaService) {}

  // Expired refresh tokens have no security value: a revoked token can only be
  // replayed while its JWT `exp` is still in the future, and once past that the
  // JWT itself fails verification. Deleting on `expiresAt < now()` therefore
  // keeps revoked tokens exactly as long as they remain forgeable, then reaps
  // both expired and revoked-and-expired rows so the table stays bounded.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeExpiredTokens(): Promise<number> {
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    })

    if (count > 0) {
      this.logger.log(`Removed ${count} expired refresh token(s)`)
    }

    return count
  }
}
