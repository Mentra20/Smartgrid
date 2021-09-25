import { Controller, Get, Query } from '@nestjs/common';
import { ProductionService } from 'src/services/production/production.service';

@Controller('check-production')
export class CheckProductionController {
    constructor(private readonly productionService: ProductionService) {}

    @Get()
    getProduction(@Query('date') dateString:Date): any {
        var date = new Date(dateString);
        return this.productionService.verifyProductionVsConsumption(date);
    }

}
