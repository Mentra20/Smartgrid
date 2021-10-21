import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProductionApiController } from './controller/production-api.controller';
import { ProductionApiService } from './service/production-api.service';

@Module({
  imports: [HttpModule],
  controllers: [ProductionApiController],
  providers: [ProductionApiService],
})
export class AppModule {}
