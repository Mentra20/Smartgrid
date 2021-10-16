import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const config = new DocumentBuilder()
    .setTitle('GlobalConsumptionDB')
    .setDescription('The GlobalConsumptionDB API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3009);
}
bootstrap();
