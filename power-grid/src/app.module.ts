import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TotalConsumptionService } from './services/total-consumption/total-consumption.service';
import { TotalConsumptionController } from './controllers/total-consumption/total-consumption.controller';

@Module({
  imports: [],
  controllers: [AppController, TotalConsumptionController],
  providers: [AppService, TotalConsumptionService],
})
export class AppModule {}
