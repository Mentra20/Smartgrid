import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {

    constructor(private SubscriptionService: SubscriptionService){}

    @Post()
    clientSubscribe(@Query("ip") ip:string,@Query("port") port:string){
        console.log("new subscribe")
        return this.SubscriptionService.subscribeClient(ip,port);
    }

    /*inutiliser pour le moment*/
    @Post("update")
    updateConnexion(@Param("idHouse") idHouse:number, @Param("ip") newIp:string,@Param("port") newPort:string){
        return this.SubscriptionService.updateSubscription(idHouse,newIp,newPort);
    }

}
