import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,
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
    })
  await app.listen();
}
bootstrap();
