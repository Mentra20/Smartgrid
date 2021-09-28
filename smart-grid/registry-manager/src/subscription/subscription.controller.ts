import { Controller, Post, Query, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {

    constructor(private SubscriptionService: SubscriptionService){}

    @Post()
    clientSubscribe(@Req() req:any,@Query("port") port:string){
        return this.SubscriptionService.subscribeClient(req.connection.remoteAddress,port);
    }

}
