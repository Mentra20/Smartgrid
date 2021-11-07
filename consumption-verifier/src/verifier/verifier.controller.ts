import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class VerifierController {


    constructor(@Inject('CONSUMPTION_VERIFIER') private client:ClientKafka){
    }

    async onModuleInit(){
        this.client.subscribeToResponseOf('electricity.frame');
        await this.client.connect();
    }

    @MessagePattern('electricity.frame')
    verifyElectricity(@Payload() message){
        var frame:{
            consumptionFrameTotal:[{houseID:string,consumption:string}],
            productionFrameTotal:[{id_producer:string,production:string}],
            startDateFrame:string,endDateFrame:string}= message.value;
        console.log("frame receive for verify : "+JSON.stringify(message.value))
        var sumConsumption = 0;
        var sumProduction = 0;
        for(var consumption of frame.consumptionFrameTotal){
            sumConsumption += +consumption.consumption
        }
        for(var production of frame.productionFrameTotal){
            sumProduction += +production.production
        }
        console.log("production : "+sumProduction+" W, consumption :"+sumConsumption + " W.")
        if(sumConsumption!=sumProduction){
            console.log("need adapt production : "+(sumConsumption-sumProduction) + " W.")
            this.client.emit("production.adapt",(sumConsumption-sumProduction))
        }
    }

}
