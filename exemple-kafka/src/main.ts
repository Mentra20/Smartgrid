import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'my-kafka-client-id',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'my-kafka-consumer',
        allowAutoTopicCreation: true
        
      }
    }
  })
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
