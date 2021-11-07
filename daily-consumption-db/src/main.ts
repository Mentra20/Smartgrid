import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'daily-consumption-db',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'daily-consumption-db',
        allowAutoTopicCreation: true
      }
    }
  })
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('DailyConsumptionDB')
    .setDescription('The DailyConsumptionDB API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3013);
  console.log("-------------------------- DAILY-CONSUMPTION-DB -------------------------");
}
bootstrap();
