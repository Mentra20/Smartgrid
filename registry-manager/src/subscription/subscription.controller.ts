import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {

    constructor(private SubscriptionService: SubscriptionService){}

    @Post()
    clientSubscribe(@Body("ip") ip:string,@Body("port") port:string){
        console.log("new subscribe")
        return this.SubscriptionService.subscribeClient(ip,port);
    }

    /*inutiliser pour le moment*/
    @Post("update")
    updateConnexion(@Body("idHouse") idHouse:number, @Body("ip") newIp:string,@Body("port") newPort:string){
        return this.SubscriptionService.updateSubscription(idHouse,newIp,newPort);
    }

}
