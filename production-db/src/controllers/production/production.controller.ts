
import { Body, Controller, Post ,Query,Get } from '@nestjs/common';
import { Production } from 'src/models/production';
import { ProductionService } from 'src/services/production/production.service';

@Controller('/')
export class ProductionController {
    
    constructor(private productionService:ProductionService){}

    @Post('push-production')
    pushProduction(
        @Body("param") productionReceived:{
            id_producer:string, 
            productionDate:Date, 
            production:number})
    {
        console.log("[production-db/push-production][pushProduction] production:any "+ productionReceived +" => void")
        console.log("new production")

        var production = new Production();
        production.id_producer = productionReceived.id_producer;
        production.productionDate = productionReceived.productionDate;
        production.production = productionReceived.production;

        this.productionService.addProductionToDB(production);

        console.log("new production added")
    }

    @Get('getproduction')
    getProduction(@Query('date') date:Date) {
        var productionSum=0;
        var ProductionList = this.productionService.getProductionByDate(date);
        console.log("[getproduction][getProduction] Get date : "+date.toDateString+" and return Production list : "+ProductionList);
        for (var elem of ProductionList){
            productionSum+=elem;
        }
        return productionSum;
    }
}
