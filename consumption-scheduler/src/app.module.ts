import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleController } from './controllers/schedule/schedule.controller';
import { ScheduleService } from './services/schedule/schedule.service';
import { AdaptConsumptionController } from './controllers/adapt-consumption/adapt-consumption.controller';
import { AdaptConsumptionService } from './services/adapt-consumption/adapt-consumption.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, ScheduleController, AdaptConsumptionController],
  providers: [AppService, ScheduleService, AdaptConsumptionService],
})
export class AppModule {}
