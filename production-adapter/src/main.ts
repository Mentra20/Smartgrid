import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,
    {
      name: 'PRODUCTION_ADAPTER',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'production-adapter',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'production-adapter',
          allowAutoTopicCreation: true,
          sessionTimeout: 30000,
        }
      }
    })
  await app.listen();
}
bootstrap();
