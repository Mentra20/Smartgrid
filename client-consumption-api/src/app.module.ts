import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientConsumptionApiController } from './controller/client-consumption-api.controller';
import { ClientConsumptionApiService } from './service/client-consumption-api.service';

@Module({
  imports: [HttpModule],
  controllers: [ClientConsumptionApiController],
  providers: [ClientConsumptionApiService],
})
export class AppModule {}
