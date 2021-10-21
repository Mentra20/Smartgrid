import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConsumptionApiController } from './controller/consumption-api.controller';
import { ConsumptionApiService } from './service/consumption-api.service';

@Module({
  imports: [HttpModule],
  controllers: [ConsumptionApiController],
  providers: [ConsumptionApiService],
})
export class AppModule {}
