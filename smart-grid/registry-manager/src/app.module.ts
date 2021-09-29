import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  imports:[HttpModule],
  controllers: [AppController, SubscriptionController],
  providers: [AppService, SubscriptionService],
})
export class AppModule {}
