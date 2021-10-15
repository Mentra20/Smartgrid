import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_EXAMPLE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'my-kafka-client-id',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'consumer-test',
            allowAutoTopicCreation: true,
            sessionTimeout: 30000,
            
          }
        }
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
