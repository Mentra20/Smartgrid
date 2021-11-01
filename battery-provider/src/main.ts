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
        clientId: 'battery-provider',
        brokers: ['kafka:9092'],
      },
    }
  })
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('battery-provider')
    .setDescription('The battery-provider API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3017);
  console.log("-------------------------- BATTERY-PROVIDER -------------------------");
}
bootstrap();
