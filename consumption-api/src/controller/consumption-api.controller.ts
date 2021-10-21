import { Controller, Get, Query } from '@nestjs/common';
import { ConsumptionApiService } from 'src/service/consumption-api.service';
@Controller()
export class ConsumptionApiController {
    constructor(
    private readonly requestManagerService: ConsumptionApiService,
  ) {}

  @Get('community-consumption')
  async getCommunityConsumption(@Query('date') date:string,@Query('communityID') communityID: number):Promise<number> {
    console.log("[RequestManagerController][getCommunityConsumption] params:"+JSON.stringify({date,communityID}))
    var housesID = await this.requestManagerService.getHousesIDFromCommunityID(communityID)
    console.log("Get houseID list : "+housesID);

    var communityCons = await this.requestManagerService.getCommunityConsumption(date,housesID);
    console.log("Get community consumption : "+communityCons + " W.");
    return communityCons;
  }
  
  @Get('total-consumption')
  async getTotalConsumption(@Query('date') date:string):Promise<number> {
    var totalCons = await this.requestManagerService.getTotalConsumption(date);
    console.log("Get total consumption : "+totalCons + " W.");
    return totalCons;
  } 
}

