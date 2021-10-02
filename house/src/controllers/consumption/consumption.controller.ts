import { Controller,Get, Query } from '@nestjs/common';
import { ConsumptionService } from 'src/services/consumption/consumption.service';

@Controller('consumption')
export class ConsumptionController {
    constructor(private readonly consumptionService: ConsumptionService) {}

    @Get()
    getConsumption(@Query("date") dateString:string): Promise<number> {
        var date = new Date(dateString);
        return this.consumptionService.getConsumption(date); 
    }
}
