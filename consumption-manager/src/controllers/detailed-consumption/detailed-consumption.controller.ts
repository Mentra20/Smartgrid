import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DetailedConsumption } from 'src/models/detailed-consumption';
import { DetailedConsumptionService } from 'src/services/detailed-consumption/detailed-consumption.service';


@Controller('')
export class DetailedConsumptionController {

    constructor(private detailedConsumptionService: DetailedConsumptionService){}

    @Post('add-detailed-consumption')
    addDetailedConsumption(
        @Body("param") objectsConsumptions:{
            houseID:string, 
            consumptionDate:Date, 
            objectName:string, 
            consumption:number}[])
    {
        //TODO: verifier si le client existe dans la DB
        console.log("[consumption-manager/add-detailed-consumption][addDetailedConsumption] objectsConsumptions:any[] "+ objectsConsumptions +" => void")
        console.log("new detailed consumptions")
        
        if(!objectsConsumptions?.length) return;

        var clientConsumptionSum = 0;
        var houseID = objectsConsumptions[0].houseID;
        var consumptionDate = objectsConsumptions[0].consumptionDate;

        for(let object of objectsConsumptions){

            var detailedConsumption = Object.assign(new DetailedConsumption(),{...object});

            this.detailedConsumptionService.addDetailedConsumptionToDB(detailedConsumption);

            clientConsumptionSum += detailedConsumption.consumption;
        }
        console.log("new detailed consumptions added")

        this.detailedConsumptionService.pushClientConsumption(houseID,consumptionDate,clientConsumptionSum);
    }


    @Get('get-detailed-consumption')
    async getDetailedConsumption(@Query('date') date:Date, @Query('houseID') houseID:string, @Query('objectName') objectName:string) {

        var detailedConsumption:DetailedConsumption = await this.detailedConsumptionService.getDetailedConsumptionByDate(houseID,date,objectName);
        console.log("[get-detailed-consumption][getDetailedConsumption] Get date : "+date.toDateString+" and house ID "+houseID+" and objectName "+objectName);

        console.log("house consumption of "+objectName+" for houseID "+ houseID +" at date "+date+" is "+detailedConsumption.consumption);

        return detailedConsumption.consumption;
    }
}
