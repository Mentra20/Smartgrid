import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {AutarkyOversightController} from "./controllers/autarky-oversight.controller";
import {AutarkyOversightService} from "./services/autarky-oversight.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTARKY-OVERSIGHT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'autarky-oversight',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'autarky-oversight',
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController, AutarkyOversightController],
  providers: [AppService, AutarkyOversightService],
})
export class AppModule {}
