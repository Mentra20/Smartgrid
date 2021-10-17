import { Controller, Get, Query } from '@nestjs/common';
import { RequestManagerService } from 'src/service/request-manager.service';
@Controller('request-manager')
export class ControllerController {
    constructor(
    private readonly requestManagerService: RequestManagerService,
  ) {}

  @Get('totalconsumptionfromcommunityid')
  async getTotalConsumptionFromCommunityID(@Query('date') date:string,@Query('communityID') communityID: number):Promise<number> {
    return this.requestManagerService.getTotalConsumptionFromCommunityID(date,await this.requestManagerService.getHousesIDFromCommunityID(communityID));
  }
  @Get('totalproductionfromdate')
  getProductionFromDate(@Query('date') date:string):Promise<number> {
    return this.requestManagerService.getTotalProductionDate(date);
  }
  @Get('totalconsumptionfromdate')
  getConsumptionFromDate(@Query('date') date:string):Promise<number> {
    return this.requestManagerService.getTotalConsumptionFromDate(date);
  } 
  @Get('global-house-consumption')
  getGlobalConsumptionFromHouseID(@Query('date') date:string,@Query('houseID') houseID: string):Promise<number> {
    return this.requestManagerService.getTotalConsumptionFromHouseID(date,houseID);
  }
  @Get('detailedconsumptionfromdate')
  getDetailedConsumption(@Query('date') dateString:string, @Query('houseID') houseID:string, @Query('objectName') objectName:string):Promise<number>{
    return this.requestManagerService.getDetailedConsumption(dateString,houseID,objectName);
  }

}

