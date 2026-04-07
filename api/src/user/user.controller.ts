import { Body, Controller, Get, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto'
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto'

@Controller('user')
export class UserController {
  constructor (private user: UserService) {}

  @Get('me')
  getMe (@CurrentUser() user: { userId: string }) {
    return this.user.getMe(user.userId)
  }

  @Put('seller-profile')
  updateSellerProfile (
    @CurrentUser() user: { userId: string; role: any },
    @Body() dto: UpdateSellerProfileDto
  ) {
    return this.user.updateSellerProfile(user.userId, user.role, dto)
  }

  @Put('customer-profile')
  updateCustomerProfile (
    @CurrentUser() user: { userId: string; role: any },
    @Body() dto: UpdateCustomerProfileDto
  ) {
    return this.user.updateCustomerProfile(user.userId, user.role, dto)
  }
}
