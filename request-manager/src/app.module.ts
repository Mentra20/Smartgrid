import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RequestManagerController } from './controller/request-manager.controller';
import { RequestManagerService } from './service/request-manager.service';

@Module({
  imports: [HttpModule],
  controllers: [RequestManagerController],
  providers: [RequestManagerService],
})
export class AppModule {}
