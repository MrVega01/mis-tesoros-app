import { Body, Controller, Get, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto'
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto'

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor (private user: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user', description: 'Returns the authenticated user with their seller or customer profile.' })
  @ApiResponse({ status: 200, description: 'Current user with profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe (@CurrentUser() user: { userId: string }) {
    return this.user.getMe(user.userId)
  }

  @Put('seller-profile')
  @ApiOperation({ summary: 'Create or update seller profile', description: 'Upserts the seller profile for the authenticated user. Requires SELLER role.' })
  @ApiResponse({ status: 200, description: 'Seller profile saved.' })
  @ApiResponse({ status: 403, description: 'Forbidden — user is not a SELLER.' })
  updateSellerProfile (
    @CurrentUser() user: { userId: string; role: any },
    @Body() dto: UpdateSellerProfileDto
  ) {
    return this.user.updateSellerProfile(user.userId, user.role, dto)
  }

  @Put('customer-profile')
  @ApiOperation({ summary: 'Create or update customer profile', description: 'Upserts the customer profile for the authenticated user. Requires CUSTOMER role.' })
  @ApiResponse({ status: 200, description: 'Customer profile saved.' })
  @ApiResponse({ status: 403, description: 'Forbidden — user is not a CUSTOMER.' })
  updateCustomerProfile (
    @CurrentUser() user: { userId: string; role: any },
    @Body() dto: UpdateCustomerProfileDto
  ) {
    return this.user.updateCustomerProfile(user.userId, user.role, dto)
  }
}
