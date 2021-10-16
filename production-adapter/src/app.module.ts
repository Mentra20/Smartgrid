import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductionAdaptController } from './controllers/production-adapt/production-adapt.controller';
import { ProductionAdaptService } from './services/production-adapt/production-adapt.service';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'PRODUCTION_ADAPTER',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'production-adapter',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'production-adapter',
          allowAutoTopicCreation: true,
        }
      }
    },
  ]),
],
  controllers: [ProductionAdaptController],
  providers: [ProductionAdaptService],
})
export class AppModule {}
