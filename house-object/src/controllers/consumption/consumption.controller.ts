import { Headers,Body, Controller, Get, Param, Req, Query } from '@nestjs/common';
import { ConsumptionService } from 'src/services/consumption/consumption.service';

@Controller('consumption')
export class ConsumptionController {
    constructor(private readonly consumptionService:ConsumptionService){}

    @Get()
    getConsumption(@Query("date") dateString:string):any{
        var date = new Date(dateString);
        var consumption = this.consumptionService.getConsumption(date)
        console.log(this.consumptionService.getObjectName()+" Consumption : "+consumption);
        return {
                    consumption,
                    objectName:this.consumptionService.getObjectName()
                }
    }
}

