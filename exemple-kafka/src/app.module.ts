import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONSUMPTION_ADDER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'my-kafka-consumer-id',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'my-kafka-consumer-group',
            allowAutoTopicCreation: true
            
          }
        }
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
