import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Scenario1Service } from './scenario1/scenario1.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [Scenario1Service],
})
export class AppModule {}
