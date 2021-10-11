import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { getConnection } from "typeorm";

@Controller('subscription')
export class SubscriptionController {

    constructor(private SubscriptionService: SubscriptionService){}

    @Post("clientSubscribe")
    async clientSubscribe(@Body("clientName") clientName:string):Promise<string>{
        console.log("[subscription][clientSubscribe] clientName:string "+ clientName + " => void");
        console.log("New client registration.\n");
        var response = await this.SubscriptionService.subscribeClient(clientName)
        console.log("[subscription][clientSubscribe] return :"+ response)
        return response;
    }

    @Post("updateClientConnection")
    updateConnexion(@Body("idHouse") idHouse:number, @Body("clientName") clientName:string){
        //console.log("[subscription/ip][clientSubscribe] ip:string "+ ip +" port:string "+ port +" => void")
        return this.SubscriptionService.updateSubscription(idHouse, clientName);
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
