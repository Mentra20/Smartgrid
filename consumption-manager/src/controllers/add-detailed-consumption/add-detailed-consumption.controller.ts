import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AddDetailedConsumptionService } from 'src/services/add-detailed-consumption/add-detailed-consumption.service';


@Controller('add-detailed-consumption')
export class AddDetailedConsumptionController {

    constructor(private AddDetailedConsumptionService: AddDetailedConsumptionService){}

    @Get()
    addDetailedConsumption(
        @Query("ID") ID:string, 
        @Query("date") date:Date, 
        @Query("name") objectName:string, 
        @Query("consumption") consumption:number)
    {
        //TODO: verifier si le client existe dans la DB
        console.log("[consumption-manager/add-detailed-consumption][addDetailedConsumption] ID:string "+ ID +
            " date:string "+ date +" objectName:string "+ objectName +" consumption:number "+ consumption +" => void")
        console.log("new detailed consumption")
        
        this.AddDetailedConsumptionService.addDetailedConsumptionToDB(ID,date,objectName,consumption);

        console.log("new detailed consumption added")
    }
}
