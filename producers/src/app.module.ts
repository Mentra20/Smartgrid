import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductionController } from './controllers/production/production.controller';
import { ProductionServiceStorage } from './services/production-storage/production-storage.service';

@Module({
  imports: [HttpModule],
  controllers: [ProductionController],
  providers: [ProductionServiceStorage],
})
export class AppModule {}
