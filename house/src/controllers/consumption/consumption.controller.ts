import { Controller,Get, Param, Query } from '@nestjs/common';
import { HousesService } from 'src/services/houses/houses.service';


@Controller('consumption')
export class ConsumptionController {
    constructor(private readonly housesService: HousesService) {}

    @Get("global")
    getConsumption(@Query("houseId") houseId:string): number {
        var consumption = this.housesService.getTotalConsumption(houseId);
        console.log("[consumption/global][getConsumption] houseId:string " +houseId + " => number ");
        console.log("controller consumption global: "+consumption)
        return consumption;
    }

    // @Get("detailed")
    // getDetailedConsumtion(@Query("date")date:string){
    //     // console.log("[consumption/datailed][getDetailedConsumption] date:string " + date + " => string");
    //     // return this.consumptionService.getDetailedConsumptuion(new Date(date));
    // }

    // @Get("detailed/:name")
    // getDetailedConsumtionByName(@Param("name") name:string,@Query("date")date:string){
    //     console.log("[consumption/detailed/:name][getDetailedConsumtionByName] date:string " + date + " => string");
    //     return this.consumptionService.getConsumptionByName(name,new Date(date));
    // }

    // @Get("houseID")
    // getHouseID():number{
    //     console.log("[consumption/houseID][getHouseID] => number");
    //     return this.subscribeService.getSubscribeID();
    // }

    // @Get("communityID")
    // getCommunityID():number{
    //     console.log("[consumption/comunityID][getHouseID] => number");
    //     return this.subscribeService.getCommunityID();
    // }
}
