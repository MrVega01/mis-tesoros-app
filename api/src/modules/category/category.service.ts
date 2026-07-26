import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

// Prisma error code for a unique-constraint violation.
const UNIQUE_VIOLATION = 'P2002'

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  findAll(sellerId: string) {
    return this.prisma.category.findMany({
      where: { sellerId },
      orderBy: { name: 'asc' }
    })
  }

  async findOne(sellerId: string, id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, sellerId }
    })
    if (!category) throw new NotFoundException('Category not found')
    return category
  }

  async create(sellerId: string, dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: { sellerId, name: dto.name }
      })
    } catch (error) {
      throw this.translateUniqueViolation(error)
    }
  }

  async update(sellerId: string, id: string, dto: UpdateCategoryDto) {
    await this.findOne(sellerId, id)

    try {
      return await this.prisma.category.update({
        where: { id },
        // Picked explicitly so a caller can never reassign `sellerId`.
        data: { name: dto.name }
      })
    } catch (error) {
      throw this.translateUniqueViolation(error)
    }
  }

  async remove(sellerId: string, id: string) {
    await this.findOne(sellerId, id)
    // Products keep existing; their categoryId is nulled by the FK (SetNull).
    await this.prisma.category.delete({ where: { id } })
    return { message: 'Category deleted' }
  }

  private translateUniqueViolation(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_VIOLATION
    ) {
      return new ConflictException('You already have a category with that name')
    }
    return error
  }
}
