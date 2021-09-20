import { Controller, Get } from '@nestjs/common';
import { TotalConsumptionService } from 'src/services/total-consumption/total-consumption.service';

@Controller('total-consumption')
export class TotalConsumptionController {
    constructor(private readonly totalConsumptionService: TotalConsumptionService) {}

    @Get()
    getTotalConsumption(): Promise<number> {
        return this.totalConsumptionService.getTotalConsumption();
    }
}

