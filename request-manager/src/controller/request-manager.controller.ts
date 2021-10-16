import { Controller } from '@nestjs/common';
import { Body,Post } from '@nestjs/common';
import { RequestManagerService } from 'src/service/request-manager.service';
@Controller('request-manager')
export class ControllerController {
    constructor(
    private readonly requestManagerService: RequestManagerService,
  ) {}

  @Post('totalconsumptionfromcommunityid')
  getTotalConsumptionFromCommunityID(@Body('date') date:string,@Body('communityID') communityID: number) {
    this.requestManagerService.getTotalConsumptionFromCommunityID(date,this.requestManagerService.getHousesIDFromCommunityID(communityID));
  }
  @Post('totalproductionfromdate')
  getProductionFromDate(@Body('date') date:string) {
    this.requestManagerService.getTotalProductionDate(date);
  }
  @Post('totalconsumptionfromdate')
  getConsumptionFromDate(@Body('date') date:string) {
    this.requestManagerService.getTotalConsumptionFromDate(date);
  } 
  @Post('totalconsumptionfromhouseid')
  getTotalConsumptionFromHouseID(@Body('date') date:string,@Body('communityID') communityID: number) {
    this.requestManagerService.getTotalConsumptionFromCommunityID(date,this.requestManagerService.getHousesIDFromCommunityID(communityID));
  }
  @Post('detailedconsumptionfromdate')
  getDetailedConsumption(@Body('date') dateString:string, @Body('houseID') houseID:string, @Body('objectName') objectName:string){
    this.requestManagerService.getDetailedConsumption(dateString,houseID,objectName);
  }

}

