import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export const DEFAULT_PORT:string="3021";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('House')
    .setDescription('The House-object API description')
    .setVersion('1.0')
    .addTag('MVP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configurationService = app.get(ConfigService);
  var PORT = configurationService.get("PORT") || DEFAULT_PORT;

  await app.listen(PORT);
}


bootstrap();
