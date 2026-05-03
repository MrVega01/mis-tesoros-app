import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'
import { RedisService } from '@core/redis/redis.service'
import { UserRole } from '@prisma/client'
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto'
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  async getMe(userId: string) {
    const cacheKey = `user:${userId}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { sellerProfile: true, customerProfile: true }
    })
    if (!user) throw new NotFoundException('User not found')

    const result = {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      hasProfile:
        user.role === UserRole.SELLER
          ? !!user.sellerProfile
          : !!user.customerProfile,
      profile:
        user.role === UserRole.SELLER
          ? user.sellerProfile
          : user.customerProfile
    }

    await this.redis.set(cacheKey, JSON.stringify(result), 300)
    return result
  }

  async updateSellerProfile(
    userId: string,
    role: UserRole,
    dto: UpdateSellerProfileDto
  ) {
    if (role !== UserRole.SELLER)
      throw new ForbiddenException('Only sellers can update seller profile')

    const profile = await this.prisma.sellerProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
        hoursOfOperation: (dto.hoursOfOperation ?? undefined) as any
      },
      update: {
        ...dto,
        hoursOfOperation: (dto.hoursOfOperation ?? undefined) as any
      }
    })

    await this.redis.del(`user:${userId}`)
    return { message: 'Seller profile updated', profile }
  }

  async updateCustomerProfile(
    userId: string,
    role: UserRole,
    dto: UpdateCustomerProfileDto
  ) {
    if (role !== UserRole.CUSTOMER)
      throw new ForbiddenException('Only customers can update customer profile')

    const profile = await this.prisma.customerProfile.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: { ...dto }
    })

    await this.redis.del(`user:${userId}`)
    return { message: 'Customer profile updated', profile }
  }
}
