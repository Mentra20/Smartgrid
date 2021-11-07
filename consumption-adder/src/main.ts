import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,
    {
      name: 'CONSUMPTION_ADDER',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'consumption-adder',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'consumption-adder',
          allowAutoTopicCreation: true,
          sessionTimeout: 30000,
        }
      }
    })
  await app.listen();
  console.log("-------------------------- CONSUMPTION-ADDER -------------------------");
}
bootstrap();
