import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HouseConsumptionController } from './controllers/house-consumption/house-consumption.controller';
import { HouseConsumptionService } from './services/house-consumption/house-consumption.service';
import { CommunitieConsumptionController } from './controllers/communitie-consumption/communitie-consumption.controller';
import { CommunitieConsumptionService } from './services/communitie-consumption/communitie-consumption.service';
import { TotalConsumptionController } from './controllers/total-consumption/total-consumption.controller';
import { TotalConsumptionService } from './services/total-consumption/total-consumption.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, HouseConsumptionController, CommunitieConsumptionController, TotalConsumptionController],
  providers: [AppService, HouseConsumptionService, CommunitieConsumptionService, TotalConsumptionService],
})
export class AppModule {}
