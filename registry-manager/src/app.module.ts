import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  imports:[HttpModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class AppModule {}
