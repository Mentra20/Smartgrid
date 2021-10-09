import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { getConnection } from "typeorm";

@Controller('subscription')
export class SubscriptionController {

    constructor(private SubscriptionService: SubscriptionService){}

    @Post()
    clientSubscribe(@Body("ip") ip:string, @Body("port") port:string){
        console.log("[subscription/ip][clientSubscribe] ip:string "+ ip +" port:string "+ port +" => void");
        console.log("New registration.\n");
        return this.SubscriptionService.subscribeClient(ip,port);
    }

    @Post("update")
    updateConnexion(@Body("idHouse") idHouse:number, @Body("ip") newIp:string, @Body("port") newPort:string){
        //console.log("[subscription/ip][clientSubscribe] ip:string "+ ip +" port:string "+ port +" => void")
        return this.SubscriptionService.updateSubscription(idHouse,newIp,newPort);
    }

}
