import { Controller, Inject,Get,Query } from '@nestjs/common';
import { DailyProductionService } from './daily-production.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { DailyProduction } from 'src/models/daily-production';

@Controller('daily-production')
export class DailyProductionController {

    constructor(private readonly dailyProductionService: DailyProductionService,
        @Inject("DAILY_PRODUCTION_DB") private client:ClientKafka) {
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf("production.raw.global");
        await this.client.connect();
        console.log("Daily Production DB connected to the bus.");
    }

    @MessagePattern("production.raw.global") 
    addProductionToDB(@Payload() productionMSG:any) {
        var production:{
            id_producer:string,
            productionDate:string,
            production:number
        }
        = productionMSG.value;

        console.log("Global production database received  " + production.id_producer + " production from Kafka : " + JSON.stringify(production));

        this.dailyProductionService.addProductionToDB(production);
    }
    @Get('daily-production')
    async getDailyProduction(@Query('id_producer') id_producer:string, @Query('productionDate') dateString:string){
        var productionDate = new Date(dateString);
        console.log("[DailyProductionController][daily-production] params : id_producer:"+id_producer+" productionDate:"+dateString);
        
        var dailyProd = await this.dailyProductionService.getDailyProductionByDate(productionDate,id_producer);
        console.log("Return daily production :"+JSON.stringify(dailyProd));
        return dailyProd;
    }

    @Get('period-production')
    async getProductionInGivenPeriod(@Query('id_producer') id_producer:string, 
        @Query('begin') begin:string,
        @Query('end') end:string){
            
        var beginDate = new Date(begin);
        var endDate = new Date(end);

        console.log("[DailyProductionController][monthly-production] params : id_producer:"+id_producer+", begin:"+begin+", end:"+end);
        
        var periodProdList:DailyProduction[] = await this.dailyProductionService.getPeriodProduction(beginDate,endDate,id_producer);
        var totalPeriodProd = 0;//W/H
        
        for(let dailyProd of periodProdList){
            totalPeriodProd += dailyProd.productionWH;
            console.log("totalPeriodProd:"+totalPeriodProd)
        }
        
        console.log("Return period production :"+totalPeriodProd);
        return totalPeriodProd;
    }
}
