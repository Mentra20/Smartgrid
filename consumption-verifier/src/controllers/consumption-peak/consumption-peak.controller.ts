import { Controller, Get, Query } from '@nestjs/common';
import { ConsumptionPeakService } from 'src/services/consumption-peak/consumption-peak.service';

@Controller('consumption-peak')
export class ConsumptionPeakController {
    constructor(private readonly consumptionPeakService: ConsumptionPeakService) {}

    @Get()
    checkIfConsumptionPeakExist(@Query('date') dateString:Date, @Query('ID') communityID:number): Promise<any> {
        var date = dateString;
        var community_id = communityID;

        return this.consumptionPeakService.verifyIfEnergyPeakExist(date, community_id);
    }
}
