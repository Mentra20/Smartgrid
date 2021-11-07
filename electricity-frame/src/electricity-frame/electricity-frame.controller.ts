import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { ElectricityFrameService } from './electricity-frame.service';

@Controller('electricity-frame')
export class ElectricityFrameController {

    constructor(private frameService:ElectricityFrameService,@Inject('CONSUMPTION_FRAME') private client:ClientKafka){
    }

    async onModuleInit(){
        this.client.subscribeToResponseOf("consumption.client");
        this.client.subscribeToResponseOf("production.raw.global");
        await this.client.connect();
        console.log('ElectricityFrameConnect')
    }

    @MessagePattern("consumption.client")
    consumptionClient(@Payload() message){
        console.log("consumption receive "+JSON.stringify(message.value) + " W.")
        var value = message.value;
        this.frameService.receiveConsumption({houseID:value.houseID,consumptionDate:new Date(value.consumptionDate),consumption:+value.consumption})
    }

    @MessagePattern("production.raw.global")
    production(@Payload() message){
        console.log("production receive :"+JSON.stringify(message.value) + " W.")

        var value = message.value;
        this.frameService.receiveProduction({id_producer:value.id_producer,productionDate:new Date(value.productionDate),production:+value.production})
    }

}
