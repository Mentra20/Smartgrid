import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumptionService } from './services/consumption/consumption.service';
import { ConsumptionController } from './controllers/consumption/consumption.controller';

@Module({
  imports: [],
  controllers: [AppController, ConsumptionController],
  providers: [AppService, ConsumptionService],
})
export class AppModule {}
