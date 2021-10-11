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
            clientId: 'consumption-adder',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'my-kafka-consumer-2',
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
