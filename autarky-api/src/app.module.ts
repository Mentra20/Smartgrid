import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AutarkyApiController } from './autarky-api/autarky-api.controller';


@Module({
  imports: [HttpModule],
  controllers: [AutarkyApiController],
  providers: [],
})
export class AppModule {}
