import { Controller,Get, Param, Query } from '@nestjs/common';
import { ConsumptionService } from 'src/services/consumption/consumption.service';
import { SubscribeService } from 'src/services/subscribe/subscribe.service';

@Controller('consumption')
export class ConsumptionController {
    constructor(private readonly consumptionService: ConsumptionService,
        private readonly subscribeService: SubscribeService) {}

    @Get("global")
    getConsumption(@Query("date") dateString:string): number {
        var date = new Date(dateString);
        return this.consumptionService.getTotalConsumption(date);
    }

    @Get("detailed")
    getDetailedConsumtion(@Query("date")date:Date){
        return this.consumptionService.getDetailedConsumptuion(date);
    }

    @Get("detailed/:name")
    getDetailedConsumtionByName(@Param("name") name:string,@Query("date")date:Date){
        return this.consumptionService.getConsumptionByName(name,date);
    }

    @Get("houseID")
    getHouseID(){
        return this.subscribeService.getSubscribeID();
    }

    @Get("communityID")
    getCommunityID(){
        return this.subscribeService.getCommunityID();
    }
}
