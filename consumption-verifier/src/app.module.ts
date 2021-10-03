import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumptionPeakController } from './controllers/consumption-peak/consumption-peak.controller';
import { ConsumptionPeakService } from './services/consumption-peak/consumption-peak.service';
import { ConsumptionCheckController } from './controllers/consumption-check/consumption-check.controller';
import { ConsumptionCheckService } from './services/consumption-check/consumption-check.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, ConsumptionPeakController, ConsumptionCheckController],
  providers: [AppService, ConsumptionPeakService, ConsumptionCheckService],
})
export class AppModule {}
