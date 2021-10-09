import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DetailedProductionService } from './services/detailed-production/detailed-production.service';
import { DetailedProductionController } from './controllers/detailed-production/detailed-production.controller';

@Module({
  imports: [],
  controllers: [AppController, DetailedProductionController],
  providers: [AppService, DetailedProductionService],
})
export class AppModule {}
