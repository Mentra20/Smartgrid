import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


export const DEFAULT_PORT:string="3001";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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
