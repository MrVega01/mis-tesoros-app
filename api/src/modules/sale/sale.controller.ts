import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { Roles } from '@common/decorators/roles.decorator'
import { RolesGuard } from '@common/guards/roles.guard'
import { SaleService } from './sale.service'
import { CreateSaleDto } from './dto/create-sale.dto'

// Note: there is deliberately no DELETE route. A sale is a financial record;
// the only way to undo one is POST /sales/:id/revert, which restores the stock
// and leaves the sale visible as REVERTED.
@ApiTags('sales')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized.' })
@ApiResponse({ status: 403, description: 'Forbidden — user is not a SELLER.' })
@Roles(UserRole.SELLER)
@UseGuards(RolesGuard)
@Controller('sales')
export class SaleController {
  constructor(private sales: SaleService) {}

  @Get()
  @ApiOperation({
    summary: 'List sales',
    description:
      'Returns the authenticated seller sales with their line items, newest first.'
  })
  @ApiResponse({ status: 200, description: 'Sales of the seller.' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.sales.findAll(user.userId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a sale',
    description: 'Returns a single sale owned by the authenticated seller.'
  })
  @ApiResponse({ status: 200, description: 'The sale.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  findOne(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.sales.findOne(user.userId, id)
  }

  @Post()
  @ApiOperation({
    summary: 'Register a sale',
    description:
      'Creates a sale and decrements the stock of every product on it, atomically. The exchange rate is taken from the seller saved rate, not from the request.'
  })
  @ApiResponse({ status: 201, description: 'Sale registered.' })
  @ApiResponse({
    status: 400,
    description: 'Unknown product, or not enough stock.'
  })
  @ApiResponse({
    status: 409,
    description: 'Stock changed while the sale was being registered.'
  })
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateSaleDto) {
    return this.sales.create(user.userId, dto)
  }

  @Post(':id/revert')
  @ApiOperation({
    summary: 'Revert a sale',
    description:
      'Returns every sold unit to stock and marks the sale REVERTED. A sale can only be reverted once.'
  })
  @ApiResponse({ status: 201, description: 'Sale reverted.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  @ApiResponse({ status: 409, description: 'Sale is already reverted.' })
  revert(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.sales.revert(user.userId, id)
  }
}
