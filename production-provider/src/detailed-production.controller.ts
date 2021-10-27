import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DetailedProductionService } from 'src/detailed-production.service';


@Controller('/')
export class DetailedProductionController {

    constructor(private DetailledProductionServices: DetailedProductionService){}

    @Post('add-production')
    addDetailedProduction(
        @Body("production") objectProduction:{
            id_producer:string, 
            productionDate:string, 
            production:number})
    {
        //TODO: verifier si le client existe dans la DB
        console.log("[production-provider][add-production] objectsProductions:any[] "+ JSON.stringify(objectProduction) +" => void")

        this.DetailledProductionServices.pushProduction(objectProduction);
    }
    @Post('add-production-limit')
    addDetailedProductionLimit(
        @Body("productionLimit") objectProductionLimit:{
            id_producer:string, 
            productionDate:string, 
            productionLimit:number,
            production:number})
    {
        //TODO: verifier si le client existe dans la DB
        console.log("[production-provider][add-production-limit] objectsProductionsLimit:any[] "+ JSON.stringify(objectProductionLimit) +" => void")

        this.DetailledProductionServices.pushProductionLimit(objectProductionLimit);
    }
}
