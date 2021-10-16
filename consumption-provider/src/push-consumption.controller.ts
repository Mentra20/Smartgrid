import { Body, Controller, Post } from '@nestjs/common';
import { PushConsumptionService } from './push-consumption.service';

@Controller('')
export class PushConsumptionController {

    constructor(private pushConsumptionService: PushConsumptionService){}

    @Post('add-detailed-consumption')
    addDetailedConsumption(
        @Body("detailedConsumptions") detailedConsumptions:{
            houseID:string, 
            consumptionDate:string, 
            object:{objectName:string, consumption:number}[]})
    {
        //TODO: verifier si le client existe dans la DB
        console.log("[consumption-provider][addDetailedConsumption] detailedConsumptions:any[] "+ detailedConsumptions +" => void")
        
        this.pushConsumptionService.pushConsumptionToBus(detailedConsumptions);
    }

}
