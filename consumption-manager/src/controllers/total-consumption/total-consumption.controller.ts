import { Controller, Get, Query } from '@nestjs/common';
import { TotalConsumptionService } from 'src/services/total-consumption/total-consumption.service';

@Controller('total-consumption')
export class TotalConsumptionController {
    constructor(private readonly totalConsumptionService: TotalConsumptionService) {}

    @Get()
    getHouseConsumption(@Query('date') dateString:Date): Promise<number> {
        var date = new Date(dateString);

        return this.totalConsumptionService.getTotalConsumption(date);
    }
}
