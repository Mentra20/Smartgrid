import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClockController } from './controllers/clock/clock.controller';
import { ClockService } from './services/clock/clock.service';

@Module({
  imports: [],
  controllers: [AppController, ClockController],
  providers: [AppService, ClockService],
})
export class AppModule {}
