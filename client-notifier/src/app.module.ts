import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT-NOTIFIER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'client-notifier',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'client-notifier',
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
