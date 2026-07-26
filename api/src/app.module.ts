import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from '@core/prisma/prisma.module'
import { RedisModule } from '@core/redis/redis.module'
import { MailModule } from '@core/mail/mail.module'
import { AuthModule } from '@modules/auth/auth.module'
import { UserModule } from '@modules/user/user.module'
import { CategoryModule } from '@modules/category/category.module'
import { ProductModule } from '@modules/product/product.module'
import { SaleModule } from '@modules/sale/sale.module'
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]),
    PrismaModule,
    RedisModule,
    MailModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    SaleModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ]
})
export class AppModule {}
