import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductionAdaptService } from 'src/services/production-adapt/production-adapt.service';

@Controller('production-adapt')
export class ProductionAdaptController {
    constructor(private readonly productionAdaptService: ProductionAdaptService,
        @Inject("PRODUCTION_ADAPTER") private client:ClientKafka) {}

    async onModuleInit() {
        this.client.subscribeToResponseOf("production.adapt");
        this.client.subscribeToResponseOf("production.limit");
        this.client.subscribeToResponseOf("production.raw.global");
        await this.client.connect();
        console.log("Production adapter connected to the Kafka bus.");
    }

    @MessagePattern("production.adapt")
    async changeProduction(@Payload() productionAdaptMSG:any) {
        var needAdaptProductionValue = await this.productionAdaptService.realAdaptNeed(+productionAdaptMSG.value);
        if (needAdaptProductionValue>0){
            await this.productionAdaptService.increaseProduction(needAdaptProductionValue);
            console.log("Producer adapter received the amount of W producers need to supply : " + needAdaptProductionValue + " W.");
        }
        else if(needAdaptProductionValue<0) {
            await this.productionAdaptService.decreaseProduction(-needAdaptProductionValue);
            console.log("Producer adapter Need to reduce : " + -needAdaptProductionValue + " W");
        }
        else{
            console.log("Production = cpnsumption");

        }
    }
    @MessagePattern("production.raw.global")
    async updateProduction(@Payload() productionAdaptMSG:any) {
        var msg = productionAdaptMSG.value
        console.log("productionRawGlobal receive :"+JSON.stringify(msg))
        await this.productionAdaptService.updateCurrentProduction(msg.id_producer,+msg.production)
        }
    
    @MessagePattern("production.limit")
    productionLimit(@Payload() message){
        console.log("productionLimit receive :"+JSON.stringify(message.value))
        var value = message.value;
        this.productionAdaptService.updateProductionLimite(value.id_producer,+value.productionLimit)
        }

}
