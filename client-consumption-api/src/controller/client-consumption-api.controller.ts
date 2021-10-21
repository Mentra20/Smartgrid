import { Controller, Get, Query } from '@nestjs/common';
import { ClientConsumptionApiService } from 'src/service/client-consumption-api.service';
@Controller()
export class ClientConsumptionApiController {
    constructor(
    private readonly requestManagerService: ClientConsumptionApiService,
  ) {}

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

