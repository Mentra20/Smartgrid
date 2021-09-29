import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumptionService } from './services/consumption/consumption.service';
import { ConsumptionController } from './controllers/consumption/consumption.controller';
import { HttpModule } from '@nestjs/axios';
import { ScheduleController } from './controllers/schedule/schedule.controller';
import { ScheduleService } from './services/schedule/schedule.service';
import { SubscribeService } from './services/subscribe/subscribe.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      HttpModule,
      ConfigModule.forRoot()
      ],
  controllers: [
      AppController, 
      ConsumptionController,
      ScheduleController
      ],
  providers: [
      AppService, 
      ConsumptionService, 
      SubscribeService, 
      ScheduleService
      ],
})
export class AppModule {}
