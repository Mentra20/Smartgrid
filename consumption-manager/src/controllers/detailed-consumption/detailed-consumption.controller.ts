import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DetailedConsumption } from 'src/models/detailed-consumption';
import { DetailedConsumptionService } from 'src/services/detailed-consumption/detailed-consumption.service';


@Controller('/')
export class DetailedConsumptionController {

    constructor(private detailedConsumptionService: DetailedConsumptionService){}

    @Post('add-detailed-consumption')
    addDetailedConsumption(@Body("param") objectsConsumptions:{houseID:string, consumptionDate:Date, objectName:string, consumption:number}[])
    {
        //TODO: verifier si le client existe dans la DB
        console.log("[consumption-manager/add-detailed-consumption][addDetailedConsumption] objectsConsumptions:any[] "+ objectsConsumptions +" => void")
        console.log("new detailed consumptions")
        
        if(!objectsConsumptions?.length) return;

        var sum = 0;
        for(let object of objectsConsumptions){

            var detailedConsumption = Object.assign(new DetailedConsumption(),{...object});

            this.detailedConsumptionService.addDetailedConsumptionToDB(detailedConsumption);

            sum += detailedConsumption.consumption;
        }
        //TODO envoyer une conso totale du client.
        console.log("new detailed consumptions added")
    }
}
