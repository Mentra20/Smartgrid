import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumptionCheckerController } from './controllers/consumption-checker/consumption-checker.controller';
import { ConsumptionCheckerService } from './services/consumption-checker/consumption-checker.service';
import { ConsumptionPeakController } from './controllers/consumption-peak/consumption-peak.controller';
import { ConsumptionPeakService } from './services/consumption-peak/consumption-peak.service';
import { ConsumptionCheckController } from './controllers/consumption-check/consumption-check.controller';
import { ConsumptionCheckService } from './services/consumption-check/consumption-check.service';

@Module({
  imports: [],
  controllers: [AppController, ConsumptionCheckerController, ConsumptionPeakController, ConsumptionCheckController],
  providers: [AppService, ConsumptionCheckerService, ConsumptionPeakService, ConsumptionCheckService],
})
export class AppModule {}
