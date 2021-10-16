import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ElectricityFrameService } from './electricity-frame.service';

@Controller('electricity-frame')
export class ElectricityFrameController {

    constructor(private frameService:ElectricityFrameService){

    }

    @MessagePattern("consumption.client")
    consumptionClient(@Payload() message){
        var value = message.value;
        this.frameService.receiveConsumption({houseID:value.houseID,consumptionDate:new Date(value.consumptionDate),consumption:+value.consumption})
    }

    @MessagePattern("production.raw.global")
    production(@Payload() message){
        var value = message.value;
        this.frameService.receiveProduction({id_producer:value.id_producer,consumptionDate:new Date(value.consumptionDate),consumption:+value.consumption})
    }

}
