import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdderController } from './adder.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONSUMPTION_ADDER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'consumption-adder-client',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'consumption-adder-consumer',
            allowAutoTopicCreation: true 
          }
        }
      },
    ]),
  ],
  controllers: [AdderController],
  providers: [],
})
export class AppModule {}
