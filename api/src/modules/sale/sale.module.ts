import { Module } from '@nestjs/common'
import { SaleController } from './sale.controller'
import { SaleService } from './sale.service'
import { SaleCleanupService } from './sale-cleanup.service'

@Module({
  controllers: [SaleController],
  providers: [SaleService, SaleCleanupService],
  exports: [SaleService]
})
export class SaleModule {}
