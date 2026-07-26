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
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@ApiTags('categories')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized.' })
@ApiResponse({ status: 403, description: 'Forbidden — user is not a SELLER.' })
@Roles(UserRole.SELLER)
@UseGuards(RolesGuard)
@Controller('categories')
export class CategoryController {
  constructor(private categories: CategoryService) {}

  @Get()
  @ApiOperation({
    summary: 'List categories',
    description: 'Returns the authenticated seller categories, ordered by name.'
  })
  @ApiResponse({ status: 200, description: 'Categories of the seller.' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.categories.findAll(user.userId)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a category',
    description: 'Creates a category owned by the authenticated seller.'
  })
  @ApiResponse({ status: 201, description: 'Category created.' })
  @ApiResponse({ status: 409, description: 'Category name already used.' })
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateCategoryDto
  ) {
    return this.categories.create(user.userId, dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Rename a category',
    description: 'Updates a category owned by the authenticated seller.'
  })
  @ApiResponse({ status: 200, description: 'Category updated.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 409, description: 'Category name already used.' })
  update(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto
  ) {
    return this.categories.update(user.userId, id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category',
    description:
      'Deletes a category owned by the authenticated seller. Its products are kept and become uncategorized.'
  })
  @ApiResponse({ status: 200, description: 'Category deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.categories.remove(user.userId, id)
  }
}
