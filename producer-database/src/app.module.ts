import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerRegistryService } from './services/producer-registry/producer-registry.service';
import { ProducerRegistryController } from './controllers/producer-registry/producer-registry.controller';

@Module({
  imports: [],
  controllers: [AppController, ProducerRegistryController],
  providers: [AppService, ProducerRegistryService],
})
export class AppModule {}
