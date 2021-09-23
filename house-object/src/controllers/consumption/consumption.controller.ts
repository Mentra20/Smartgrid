import { Body, Controller, Get } from '@nestjs/common';
import { ConsumptionService } from 'src/services/consumption/consumption.service';

@Controller('consumption')
export class ConsumptionController {
    constructor(private readonly consumptionService:ConsumptionService){}

    @Get()
    getConsumption(@Body() date:Date):any{
        var consumption = this.consumptionService.getConsumption(date)
        console.log(this.consumptionService.getObjectName()+" Consumption : "+consumption);
        return {
                    consumption,
                    objectName:this.consumptionService.getObjectName()
                }
    }
}

