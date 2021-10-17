import { Controller, Get, Inject, Query } from '@nestjs/common';
import { DetailedConsumption } from 'src/models/detailed-consumption';
import { DetailedConsumptionService } from 'src/services/detailed-consumption/detailed-consumption.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('')
export class DetailedConsumptionController {

    constructor(
        private detailedConsumptionService: DetailedConsumptionService,
        @Inject("CONSUMPTION_DETAILED") private client:ClientKafka){}

    async onModuleInit() {
        this.client.subscribeToResponseOf("consumption.raw.detailed");
        await this.client.connect();

        console.log("consumption-detailed connected on bus")
    }

    @MessagePattern("consumption.raw.detailed")
    async StoreDetailedConsumption(@Payload() detailedConsumptionsMSG:any){
        console.log("[detailed-consumption][StoreDetailedConsumption] detailedConsumptionsMSG:any "+ detailedConsumptionsMSG +" => void")

        var detailedConsumptions:{
            houseID:string, 
            consumptionDate:string, 
            object:{objectName:string, consumption:number}[]
        }
        = detailedConsumptionsMSG.value;

        await this.detailedConsumptionService.storeAllDetailedConsumptionInDB(detailedConsumptions);
        console.log("detailed consumptions are store in DB");
    }

    @Get('get-detailed-consumption')
    async getDetailedConsumption(@Query('date') dateString:string, @Query('houseID') houseID:string, @Query('objectName') objectName:string) {
        var date = new Date(dateString);
        var detailedConsumption:DetailedConsumption = (await this.detailedConsumptionService.getDetailedConsumptionByDate(houseID,date,objectName));
        console.log("[detailed-consumption][get-detailed-consumption] Get date : "+date+" and house ID "+houseID+" and objectName "+objectName);

        console.log("house consumption of "+objectName+" for houseID "+ houseID +" at date "+date+" is "+(detailedConsumption?.consumption||0));

        return detailedConsumption?.consumption||0;
    }
}
