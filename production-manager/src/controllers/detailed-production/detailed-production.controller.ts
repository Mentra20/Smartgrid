import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DetailedProductionService } from 'src/services/detailed-production/detailed-production.service';


@Controller('/')
export class DetailedProductionController {

    constructor(private DetailledProductionServices: DetailedProductionService){}

    @Post('add-detailed-production')
    addDetailedProduction(
        @Body("param") objectsProductions:{
            id_producer:string, 
            productionDate:Date, 
            production:number})
    {
        //TODO: verifier si le client existe dans la DB
        console.log("[production-manager/add-detailed-production][addDetailedProduction] objectsProductions:any[] "+ objectsProductions +" => void")
        console.log("new detailed production")

        var production = objectsProductions.production;
        var id_producer = objectsProductions.id_producer;
        var productionDate = objectsProductions.productionDate;

        this.DetailledProductionServices.pushProduction(id_producer,productionDate,production);
    }
}
