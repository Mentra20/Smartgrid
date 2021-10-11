import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
          groupId: 'my-kafka-consumer-2',
          allowAutoTopicCreation: true
      }
    }
  })
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
