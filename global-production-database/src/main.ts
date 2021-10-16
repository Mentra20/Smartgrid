import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';

export const DEFAULT_PORT:string="3001";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'global-production-database',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'global-production-database',
        allowAutoTopicCreation: true,
        sessionTimeout: 30000,
      }
    }
})
await app.startAllMicroservices();
  const config = new DocumentBuilder()
    .setTitle('productionDB')
    .setDescription('The productionDB API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(DEFAULT_PORT);
}


bootstrap();
