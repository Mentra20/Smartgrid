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
        await this.client.connect();
        console.log("Production adapter connected to the Kafka bus.");
    }

    @MessagePattern("production.adapt")
    changeProduction(@Payload() productionAdaptMSG:any) {
        var amountToAdd = +productionAdaptMSG.value.productionToAdd;
        console.log("Producer adapter received the amount of W producers need to supply : " + amountToAdd + " W.");
        this.productionAdaptService.adaptProduction(amountToAdd);
    }
    @MessagePattern("production.limit")
    productionLimit(@Payload() message){
        console.log("productionLimit receive :"+JSON.stringify(message.value))
        var value = message.value;
        var messageJson={id_producer:value.id_producer,productionDate:new Date(value.productionDate),productionLimit:+value.productionLimit,production:+value.production}
        var bool = this.productionAdaptService.receiveProductionLimit(messageJson)
        if (bool) {
            this.client.emit("production.reached.limit",messageJson)
        }
    }

}
