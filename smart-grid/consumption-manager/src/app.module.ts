import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HouseConsumptionController } from './controllers/house-consumption/house-consumption.controller';
import { HouseConsumptionService } from './services/house-consumption/house-consumption.service';
import { CommunitieConsumptionController } from './controllers/communitie-consumption/communitie-consumption.controller';
import { CommunitieConsumptionService } from './services/communitie-consumption/communitie-consumption.service';

@Module({
  imports: [],
  controllers: [AppController, HouseConsumptionController, CommunitieConsumptionController],
  providers: [AppService, HouseConsumptionService, CommunitieConsumptionService],
})
export class AppModule {}
