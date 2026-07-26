import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '@core/prisma/prisma.service'

@Injectable()
export class SaleCleanupService {
  private readonly logger = new Logger(SaleCleanupService.name)

  constructor(private prisma: PrismaService) {}

  // A sale outlives the accounts on it: deleting a user detaches them
  // (`onDelete: SetNull`) rather than erasing history the other party may still
  // need. Once BOTH the seller and the customer are gone the row belongs to
  // nobody and can never be read again, so it is reaped here. Postgres cannot
  // express "delete when both FKs are null" declaratively, hence the cron.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeOrphanedRecords(): Promise<{ sales: number; products: number }> {
    const { count: sales } = await this.prisma.sale.deleteMany({
      where: { sellerId: null, customerId: null }
    })

    // Products detach on user deletion too (SaleItem's Restrict FK would
    // otherwise make a seller with sales undeletable). One is only removable
    // once no sale line points at it, which is why this runs after the sales
    // above have been deleted and taken their line items with them.
    const { count: products } = await this.prisma.product.deleteMany({
      where: { sellerId: null, saleItems: { none: {} } }
    })

    if (sales > 0 || products > 0) {
      this.logger.log(
        `Removed ${sales} orphaned sale(s) and ${products} orphaned product(s)`
      )
    }

    return { sales, products }
  }
}
