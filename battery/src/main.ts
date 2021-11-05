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
        clientId: 'battery',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'battery',
        allowAutoTopicCreation: true
      }
    }
  })
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Battery')
    .setDescription('The Battery API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3018);
  console.log("-------------------------- BATTERY -------------------------");
}
bootstrap();
