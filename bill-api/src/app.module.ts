import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BillController } from './controllers/bill/bill.controller';
import { BillService } from './services/bill/bill.service';


@Module({
  imports: [HttpModule],
  controllers: [BillController],
  providers: [BillService],
})
export class AppModule {}
