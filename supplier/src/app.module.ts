import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductionService } from './services/production/production.service';
import { ProductionController } from './controllers/production/production.controller';

@Module({
  imports: [],
  controllers: [AppController, ProductionController],
  providers: [AppService, ProductionService],
})
export class AppModule {}
