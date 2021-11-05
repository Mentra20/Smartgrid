import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'client-notifier',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'client-notifier',
        allowAutoTopicCreation: true,
        sessionTimeout: 30000,
      },
    },
  });
  await app.startAllMicroservices();
  const config = new DocumentBuilder()
    .setTitle('ClientNotifier')
    .setDescription('The ClientNotifier API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3031);
  console.log(
    '-------------------------- CLIENT-NOTIFIER -------------------------',
  );
}
bootstrap();
