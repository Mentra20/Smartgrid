import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from './controllers/bill/bill.controller';
import { ClientBill } from './models/client-bill';
import { BillService } from './services/bill/bill.service';
import { MockCronController } from './controllers/mock-cron/mock-cron.controller';


@Module({
  imports: [HttpModule,
    TypeOrmModule.forFeature([ClientBill]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'SI5-SOA',
      password: 'SI5-SOA',
      database: 'SI5-SOA',
      entities: [ClientBill],
      synchronize: true,
    })
  ],
  controllers: [BillController, MockCronController],
  providers: [BillService],
})
export class AppModule {}
