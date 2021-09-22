import { Controller,Get } from '@nestjs/common';
import { ConsumptionService } from 'src/services/consumption/consumption.service';

@Controller('consumption')
export class ConsumptionController {
    constructor(private readonly consumptionService: ConsumptionService) {}

    @Get()
    getConsumption(): number {
        return this.consumptionService.getConsumption();
    }
}
