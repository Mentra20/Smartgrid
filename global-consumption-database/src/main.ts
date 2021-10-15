import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'global-consumption-database',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'global-consumption-databse',
          allowAutoTopicCreation: true,
          sessionTimeout: 30000,
        }
      }
  })
  await app.startAllMicroservices();
  await app.listen(3009);
}
bootstrap();
