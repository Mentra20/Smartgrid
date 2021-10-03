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
        var consumption = this.consumptionService.getTotalConsumption(date)
        console.log("controller consumption global: "+consumption)
        return consumption;
    }

    @Get("detailed")
    getDetailedConsumtion(@Query("date")date:string){
        return this.consumptionService.getDetailedConsumptuion(new Date(date));
    }

    @Get("detailed/:name")
    getDetailedConsumtionByName(@Param("name") name:string,@Query("date")date:string){
        return this.consumptionService.getConsumptionByName(name,new Date(date));
    }

    @Get("houseID")
    getHouseID():number{
        return this.subscribeService.getSubscribeID();
    }

    @Get("communityID")
    getCommunityID():number{
        return this.subscribeService.getCommunityID();
    }
}
