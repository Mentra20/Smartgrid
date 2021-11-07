import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export const DEFAULT_PORT:string="3006";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'production-provider',
        brokers: ['kafka:9092'],
      },
    }
  })
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('ProductionProvider')
    .setDescription('The ProductionProvider API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configurationService = app.get(ConfigService);
  var PORT = configurationService.get("PORT") || DEFAULT_PORT;

  await app.listen(PORT);
  console.log("-------------------------- PRODUCTION-PROVIDER -------------------------");
}


bootstrap();
