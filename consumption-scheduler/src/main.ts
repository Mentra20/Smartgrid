import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    name: 'CONSUMPTION_SCHEDULER',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'consumption-scheduler',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'consumption-scheduler',
        allowAutoTopicCreation: true,
      },
    },
  });
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('consumption-scheduler')
    .setDescription('The consumption-scheduler API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3002);
  console.log("-------------------------- CONSUMPTION-SCHEDULER -------------------------");
}
bootstrap();
