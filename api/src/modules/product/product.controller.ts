import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@ApiTags('products')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized.' })
@ApiResponse({ status: 403, description: 'Forbidden — user is not a SELLER.' })
@Roles(UserRole.SELLER)
@UseGuards(RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private products: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'List products',
    description:
      'Returns the authenticated seller products with their category, newest first.'
  })
  @ApiResponse({ status: 200, description: 'Products of the seller.' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.products.findAll(user.userId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a product',
    description: 'Returns a single product owned by the authenticated seller.'
  })
  @ApiResponse({ status: 200, description: 'The product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.products.findOne(user.userId, id)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a product',
    description: 'Creates a product owned by the authenticated seller.'
  })
  @ApiResponse({ status: 201, description: 'Product created.' })
  @ApiResponse({
    status: 400,
    description: 'Category not owned by the seller.'
  })
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateProductDto
  ) {
    return this.products.create(user.userId, dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a product',
    description:
      'Partially updates a product owned by the authenticated seller. Send `categoryId: null` to uncategorize it.'
  })
  @ApiResponse({ status: 200, description: 'Product updated.' })
  @ApiResponse({
    status: 400,
    description: 'Category not owned by the seller.'
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.products.update(user.userId, id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Deletes a product owned by the authenticated seller.'
  })
  @ApiResponse({ status: 200, description: 'Product deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.products.remove(user.userId, id)
  }
}
