import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientNotifierController } from './controllers/client-notifier.controller';
import { ClientNotifierService } from './services/client-notifier.service';

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
  controllers: [AppController, ClientNotifierController],
  providers: [AppService, ClientNotifierService],
})
export class AppModule {}
