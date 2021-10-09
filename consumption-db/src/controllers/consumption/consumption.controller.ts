import { Body, Controller, Post } from '@nestjs/common';
import { HouseConsumption } from 'src/models/house-consumption';
import { ConsumptionService } from 'src/services/consumption/consumption.service';

@Controller('/')
export class ConsumptionController {
    
    constructor(private consumptionService:ConsumptionService){}

    @Post('push-house-consumption')
    pushHouseConsumption(
        @Body("param") houseConsumptionReceived:{
            houseID:string, 
            consumptionDate:Date, 
            consumption:number})
    {
        console.log("[consumption-db/push-house-consumption][pushHouseConsumption] houseConsumption:any "+ houseConsumption +" => void")
        console.log("new house consumption")

        var houseConsumption = new HouseConsumption();
        houseConsumption.houseID = houseConsumptionReceived.houseID;
        houseConsumption.consumptionDate = houseConsumptionReceived.consumptionDate;
        houseConsumption.consumption = houseConsumptionReceived.consumption;

        this.consumptionService.addHouseConsumptionToDB(houseConsumption);

        console.log("new house consumption added")
    }

}
