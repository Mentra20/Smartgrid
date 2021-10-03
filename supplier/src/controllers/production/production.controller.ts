import { Controller,Get, Query } from '@nestjs/common';
import { ProductionService } from 'src/services/production/production.service';

@Controller()
export class ProductionController {
    constructor(private readonly productionService: ProductionService) {}

    @Get('get-production')
    getProduction(): number {
        console.log("[get-production][getProduction] => number")
        return this.productionService.getProduction();
    }

    @Get('change-production')
    changeProductionAndReturnIt(@Query('consumption') consumption:number): number {
        console.log("[change-production][changeProductionAndReturnIt] consumption:number "+consumption+" => number")
        this.productionService.setProduction(consumption);
        return this.productionService.getProduction();
    }
}
