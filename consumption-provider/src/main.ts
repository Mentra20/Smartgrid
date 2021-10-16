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
        clientId: 'consumption-provider',
        brokers: ['kafka:9092'],
      },
    }
  })
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('consumption-provider')
    .setDescription('The consumption-provider API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3012);
}
bootstrap();
