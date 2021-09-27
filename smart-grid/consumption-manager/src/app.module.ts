import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HouseConsumptionController } from './controllers/house-consumption/house-consumption.controller';
import { HouseConsumptionService } from './services/house-consumption/house-consumption.service';

@Module({
  imports: [],
  controllers: [AppController, HouseConsumptionController],
  providers: [AppService, HouseConsumptionService],
})
export class AppModule {}
