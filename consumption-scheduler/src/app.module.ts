import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleController } from './controllers/schedule/schedule.controller';
import { ScheduleService } from './services/schedule/schedule.service';

@Module({
  imports: [],
  controllers: [AppController, ScheduleController],
  providers: [AppService, ScheduleService],
})
export class AppModule {}
