import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DetailedProductionService } from './services/detailed-production/detailed-production.service';
import { DetailedProductionController } from './controllers/detailed-production/detailed-production.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      HttpModule,
      ConfigModule,
    ],
  controllers: [AppController, DetailedProductionController],
  providers: [AppService, DetailedProductionService],
})
export class AppModule {}
