import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Scenario1Service } from './scenarios/scenario1.service';
import { Scenario2Service } from './scenarios/scenario2.service';
import { Scenario3Service } from './scenarios/scenario3.service';
import { Scenario4Service } from './scenarios/scenario4.service';
import { ScenarioManagerService } from './scenarios/scenario-manager.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [Scenario1Service, Scenario2Service,Scenario3Service,Scenario4Service,ScenarioManagerService],
})
export class AppModule {}
