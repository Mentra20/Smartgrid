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
        clientId: 'partner-api',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'partner-api',
        allowAutoTopicCreation: true
        
      }
    }
  })
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Partner-api')
    .setDescription('The Partner-api API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3019);
  console.log("-------------------------- PARTNER-API -------------------------");
}
bootstrap();
