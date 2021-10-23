import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('bill-api')
  .setDescription('The bill API description')
  .setVersion('1.0')
  .addTag('MVP')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(3666);
  console.log("-------------------------- BILL-API -------------------------");

}
bootstrap();
