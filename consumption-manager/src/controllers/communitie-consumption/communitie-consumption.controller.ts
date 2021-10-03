import { Controller, Get, Query } from '@nestjs/common';
import { CommunitieConsumptionService } from 'src/services/communitie-consumption/communitie-consumption.service';

@Controller('community-consumption')
export class CommunitieConsumptionController {
    constructor(private readonly communitieConsumptionService: CommunitieConsumptionService) {}

    @Get()
    getHouseConsumption(@Query('date') dateString:Date, @Query('ID') communitieID:number): Promise<number> {
        var date = new Date(dateString);
        console.log("[consumption-manager][getHouseConsumption] dateString:Date "+ dateString + " ; communityID:number "+ communitieID + " => Promise<number>");
        
        return this.communitieConsumptionService.getCommunitieConsumption(date, communitieID);
    }
}
