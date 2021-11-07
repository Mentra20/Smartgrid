import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    name:"CONSUMPTION_FRAME",
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'consumption-frame',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'consumption-frame',
        allowAutoTopicCreation: true
        
      }
    }
  })

  await app.startAllMicroservices();

  await app.listen(3015);
  console.log("---------------------- Electricity Frame ------------------------")
}
bootstrap();
