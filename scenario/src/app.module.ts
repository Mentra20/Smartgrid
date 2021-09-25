import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Scenario1Service } from './scenarios/scenario1.service';
import { Scenario2Service } from './scenarios/scenario2.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [Scenario1Service, Scenario2Service],
})
export class AppModule {}
