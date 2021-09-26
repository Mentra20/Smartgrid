import { Controller,Get } from '@nestjs/common';
import { ProductionService } from 'src/services/production/production.service';

@Controller('production')
export class ProductionController {
    constructor(private readonly productionService: ProductionService) {}

    @Get()
    getProduction(): number {
        return this.productionService.getProduction();
    }
}
