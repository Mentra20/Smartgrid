import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClockController } from './controllers/clock/clock.controller';

@Module({
  imports: [],
  controllers: [AppController, ClockController],
  providers: [AppService],
})
export class AppModule {}
