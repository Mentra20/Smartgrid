import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,
    {
      name: 'CONSUMPTION_PEAK',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'consumption-peak',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'consumption-peak',
          allowAutoTopicCreation: true,
          sessionTimeout: 30000,
        }
      }
    })
  await app.listen();
}
bootstrap();
