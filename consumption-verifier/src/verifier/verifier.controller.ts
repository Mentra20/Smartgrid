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
        var frame:{consumptionFrameTotal:[{houseID:string,consumptionClient:string}],productionFrameTotal:[{id_producer:string,consumptionClient:string}],startDateFrame:string,endDateFrame:string}= message.value;
        var sumConsumption = 0;
        var sumProduction = 0;
        for(var consumption of frame.consumptionFrameTotal){
            sumConsumption +=Number(consumption.consumptionClient)
        }
        for(var production of frame.productionFrameTotal){
            sumProduction +=Number(production.consumptionClient)
        }

        if(sumConsumption!=sumProduction){
            console.log("need adapt production : "+(sumConsumption-sumProduction))
            this.client.emit("production.adapt",sumConsumption-sumProduction)
        }
    }

}
