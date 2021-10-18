import { Controller, Get, Query } from '@nestjs/common';
import { RequestManagerService } from 'src/service/request-manager.service';
@Controller()
export class RequestManagerController {
    constructor(
    private readonly requestManagerService: RequestManagerService,
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

  @Get('total-production')
  async getTotalProduction(@Query('date') date:string):Promise<number> {
    var totalProd = await this.requestManagerService.getTotalProduction(date);
    console.log("Get total production : "+totalProd + " W.");
    return totalProd;
  }

  @Get('detailed-production')
  async getDetailedProduction(@Query('date') date:string,@Query('producerID') producerID:string):Promise<number> {
    var detailedProd = await this.requestManagerService.getDetailedProduction(date,producerID);
    console.log("Get detailed production : "+detailedProd);
    return detailedProd;
  } 

  @Get('total-consumption')
  async getTotalConsumption(@Query('date') date:string):Promise<number> {
    var totalCons = await this.requestManagerService.getTotalConsumption(date);
    console.log("Get total consumption : "+totalCons + " W.");
    return totalCons;
  } 

  @Get('house-global-consumption')
  async getHouseGlobalConsumption(@Query('date') date:string,@Query('houseID') houseID: string):Promise<number> {
    var houseGlobalCons = await this.requestManagerService.getHouseGlobalConsumption(date,houseID);
    console.log("Get house global consumption : "+houseGlobalCons + " W.");
    return houseGlobalCons;
  }
  @Get('house-detailed-consumption')
  async getHouseDetailedConsumption(@Query('date') dateString:string, @Query('houseID') houseID:string, @Query('objectName') objectName:string):Promise<number>{
    var houseDetailedCons = await this.requestManagerService.getHouseDetailedConsumption(dateString,houseID,objectName);
    console.log("Get house detailed consumption : "+houseDetailedCons);
    return houseDetailedCons;
  }

}

