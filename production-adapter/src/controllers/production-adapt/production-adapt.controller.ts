import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductionAdaptService } from 'src/services/production-adapt/production-adapt.service';

@Controller('production-adapt')
export class ProductionAdaptController {
    constructor(private readonly productionAdaptService: ProductionAdaptService,
        @Inject("PRODUCTION_VERIFIER") private client:ClientKafka) {}
    
    async onModuleInit() {
        this.client.subscribeToResponseOf("production.adapt");
        await this.client.connect();
        console.log("Production adapter connected to the Kafka bus.");
    }

    @MessagePattern("production.adapt")
    changeProduction(@Payload() productionAdaptMSG:any) {
        var amountToAdd = Number(productionAdaptMSG.value);
        console.log("Producer adapter received the amount of kW producers need to supply : " + amountToAdd + " W.");
        this.productionAdaptService.adaptProduction(amountToAdd);
    }

}
