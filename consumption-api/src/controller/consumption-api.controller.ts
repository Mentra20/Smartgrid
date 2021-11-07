import { Controller, Get, Query } from '@nestjs/common';
import { ConsumptionApiService } from 'src/service/consumption-api.service';
@Controller()
export class ConsumptionApiController {
    constructor(
    private readonly consumptionAPIService: ConsumptionApiService,
  ) {}

  @Get('community-consumption')
  async getCommunityConsumption(@Query('date') date:string,@Query('communityID') communityID: number):Promise<number> {
    console.log("[ConsumptionApiController][getCommunityConsumption] params:"+JSON.stringify({date,communityID}))
    var housesID = await this.consumptionAPIService.getHousesIDFromCommunityID(communityID)
    console.log("Get houseID list : "+housesID);

    var communityCons = await this.consumptionAPIService.getCommunityConsumption(date,housesID);
    console.log("Get community consumption : "+communityCons + " W.");
    return communityCons;
  }
  
  @Get('total-consumption')
  async getTotalConsumption(@Query('date') date:string):Promise<number> {
    var totalCons = await this.consumptionAPIService.getTotalConsumption(date);
    console.log("Get total consumption : "+totalCons + " W.");
    return totalCons;
  }
  @Get('daily-consumption') 
  async getDailyConsumption(@Query('houseID') houseID:string,@Query('consumptionDate') consumptionDate:string):Promise<number> {
    var dailyCons = await this.consumptionAPIService.getDailyConsumption(houseID,consumptionDate);
    console.log("Get daily consumption : "+dailyCons);
    return dailyCons;
  }
  @Get('period-consumption') 
  async getPeriodConsumption(@Query('houseID') houseID:string,@Query('begin') begin:string,@Query('end') end:string):Promise<number> {
    var periodCons = await this.consumptionAPIService.getPeriodConsumption(houseID,begin,end);
    console.log("Get period consumption : "+periodCons);
    return periodCons;
  } 
}

