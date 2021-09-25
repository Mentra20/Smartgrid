import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductionService } from './services/production/production.service';
import { ProductionController } from './controllers/production/production.controller';
import { HttpModule } from '@nestjs/axios';
import { CheckProductionController } from './check-production/check-production.controller';
import { CheckProductionController } from './controllers/check-production/check-production.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, ProductionController, CheckProductionController],
  providers: [AppService, ProductionService],
})
export class AppModule {}
