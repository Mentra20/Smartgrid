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
        var amountToAdd = +productionAdaptMSG.value;
        if (amountToAdd>=0){
            console.log("Producer adapter received the amount of W producers need to supply : " + amountToAdd + " W.");
            let maybeNegatif = await this.productionAdaptService.adaptProduction(amountToAdd);
            if (maybeNegatif != -1){
                let messageJson = {needSupplyAmount:maybeNegatif}
                console.log("Producer adapter Need to supply : " + amountToAdd + " W but the limit is reached.");
                this.client.emit("production.reached.limit",messageJson)
                }
        }
        else {
            await this.productionAdaptService.adaptProductionNegative(amountToAdd);
            console.log("Producer adapter Need to reduce : " + amountToAdd + " W");
        }
    }
    @MessagePattern("production.raw.global")
    async updateProduction(@Payload() productionAdaptMSG:any) {
        var msg = productionAdaptMSG.value
        console.log("productionRawGlobal receive :"+JSON.stringify(msg.value))
        var messageJson={id_producer:msg.id_producer,productionDate:new Date(msg.productionDate),production:+msg.production}
        await this.productionAdaptService.updateProductionLimit(messageJson)
        }
    
    @MessagePattern("production.limit")
    productionLimit(@Payload() message){
        console.log("productionLimit receive :"+JSON.stringify(message.value))
        var value = message.value;
        var messageJson={id_producer:value.id_producer,productionDate:new Date(value.productionDate),productionLimit:+value.productionLimit,production:+value.production}
        this.productionAdaptService.saveProductionLimit(messageJson)
        }

}
