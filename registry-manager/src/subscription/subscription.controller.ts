import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { getConnection } from "typeorm";

@Controller('subscription')
export class SubscriptionController {

    constructor(private SubscriptionService: SubscriptionService){}

    @Post("clientSubscribe")
    clientSubscribe(@Body("ip") ip:string, @Body("port") port:string){
        console.log("[subscription/ip][clientSubscribe] ip:string "+ ip +" port:string "+ port +" => void");
        console.log("New client registration.\n");
        return this.SubscriptionService.subscribeClient(ip,port);
    }

    @Post("updateClientConnection")
    updateConnexion(@Body("idHouse") idHouse:number, @Body("ip") newIp:string, @Body("port") newPort:string){
        //console.log("[subscription/ip][clientSubscribe] ip:string "+ ip +" port:string "+ port +" => void")
        return this.SubscriptionService.updateSubscription(idHouse,newIp,newPort);
    }

    @Post("producerSubscribe")
    producerSubscribe(@Body("producerName") producerName:string) {
        console.log("[subscription][producerSubscribe] producerName:string " + producerName + " => void\n");
        console.log("New producer registration.\n");
        return this.SubscriptionService.subscribeProducer(producerName);
    }

    @Post("updateProducerName")
    updateProducerName(@Body("producerID") producerID:number, @Body("producerNewName") producerNewName:string) {
        console.log("[subscription][updateProducerName] producerID:number " + producerID + " producerNewName:string "
        + producerNewName + " => void\n");
        return this.SubscriptionService.updateProducerName(producerID, producerNewName);
    }

}
