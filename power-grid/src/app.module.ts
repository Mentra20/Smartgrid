import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TotalConsumptionService } from './services/total-consumption/total-consumption.service';
import { TotalConsumptionController } from './controllers/total-consumption/total-consumption.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, TotalConsumptionController],
  providers: [AppService, TotalConsumptionService],
})
export class AppModule {}
