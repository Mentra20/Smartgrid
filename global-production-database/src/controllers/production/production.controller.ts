import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Body, Controller, Post, Query, Get, Inject } from '@nestjs/common';
import { Production } from 'src/models/production';
import { ProductionService } from 'src/services/production/production.service';

@Controller('global-production')
export class GlobalProductionController {

    constructor(private productionService: ProductionService,
        @Inject("GLOBAL_PRODUCTION_DB") private client: ClientKafka) { }

    async onModuleInit() {
        this.client.subscribeToResponseOf("production.raw.global");
        await this.client.connect();
        console.log("Global production database connected to the bus.");
    }
    
    @MessagePattern("production.raw.global")
    addClientConsumptionToDB(@Payload() totalProductionMSG: any) {
        var productionReceived: {
            id_producer: string,
            productionDate: string,
            production: number
        } = totalProductionMSG.value;


        console.log("Global production database received the total production from Kafka : " + JSON.stringify(productionReceived));

        var production = new Production();
        production.id_producer = productionReceived.id_producer;
        production.productionDate = new Date(productionReceived.productionDate);
        production.production = productionReceived.production;

        this.productionService.addProductionToDB(production);

        console.log("new production added")
    }

    @Get('get-production')
    async getProduction(@Query('date') dateString: string) {
        var date = new Date(dateString)
        var productionSum = 0;
        var ProductionList = await this.productionService.getProductionByDate(date);
        console.log("[getproduction][getProduction] Get date : " + date.toDateString() + " and return Production list : " + ProductionList);
        for (var elem of ProductionList) {
            productionSum += elem.production;
        }
        return productionSum;
    }

    @Get('get-producer-production')
    async getProducerProduction(@Query('date') dateString: string, @Query('producerID') producerID: string): Promise<number> {
        var date = new Date(dateString)
        var production = await this.productionService.getProducerProductionByDate(date, producerID)
        return production.production;

    }
}
