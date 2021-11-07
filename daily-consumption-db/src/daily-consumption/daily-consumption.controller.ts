import { Controller, Get, Inject, Query } from '@nestjs/common';
import { DailyConsumptionService } from './daily-consumption.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { DailyConsumption } from 'src/models/daily-consumption';

@Controller('daily-consumption')
export class DailyConsumptionController {

    constructor(private readonly dailyConsumptionService: DailyConsumptionService,
        @Inject("DAILY_CONSUMPTION_DB") private client:ClientKafka) {
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf("consumption.client");
        await this.client.connect();
        console.log("Daily Consumption DB connected to the bus.");
    }

    @MessagePattern("consumption.client") 
    addClientConsumptionToDB(@Payload() totalClientConsumptionMSG:any) {
        var totalClientConsumption:{
            houseID:string,
            consumptionDate:string,
            consumption:number
        }
        = totalClientConsumptionMSG.value;

        console.log("Global consumption database received the total client " + totalClientConsumption.houseID + " consumption from Kafka : " + JSON.stringify(totalClientConsumption));

        this.dailyConsumptionService.addClientConsumptionToDB(totalClientConsumption);
    }

    @Get('daily-consumption')
    async getDailyConsumption(@Query('houseID') houseID:string, @Query('consumptionDate') dateString:string){
        var consumptionDate = new Date(dateString);
        console.log("[DailyConsumptionController][daily-consumption] params : houseID:"+houseID+" consumptionDate:"+dateString);
        
        var dailyCons = await this.dailyConsumptionService.getHouseConsumptionByDate(consumptionDate,houseID);
        console.log("Return daily consumption :"+JSON.stringify(dailyCons));
        return dailyCons;
    }

    @Get('period-consumption')
    async getConsumptionInGivenPeriod(@Query('houseID') houseID:string, 
        @Query('begin') begin:string,
        @Query('end') end:string){
            
        var beginDate = new Date(begin);
        var endDate = new Date(end);

        console.log("[DailyConsumptionController][monthly-consumption] params : houseID:"+houseID+", begin:"+begin+", end:"+end);
        
        var periodConsList:DailyConsumption[] = await this.dailyConsumptionService.getHousePeriodConsumption(beginDate,endDate,houseID);
        var totalPeriodCons = 0;//W/H
        
        for(let dailyCons of periodConsList){
            totalPeriodCons += dailyCons.consumptionWH;
            console.log("totalPeriodCons:"+totalPeriodCons)
        }
        
        console.log("Return period consumption :"+totalPeriodCons);
        return totalPeriodCons;
    }
}
