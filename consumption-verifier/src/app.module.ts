import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VerifierController } from './verifier/verifier.controller';


@Module({
  imports: [ClientsModule.register([
    {
      name: 'CONSUMPTION_VERIFIER',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'consumption-verifier',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'consumption-verifier',
          allowAutoTopicCreation: true,
          sessionTimeout: 30000,
        }
      }
    }
  ])],
  controllers: [ VerifierController],
  providers: [],
})
export class AppModule {}
