import { Controller, Get, Query } from '@nestjs/common';
import { ProductionApiService } from 'src/service/production-api.service';
@Controller()
export class ProductionApiController {
    constructor(
    private readonly requestManagerService: ProductionApiService,
  ) {}

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

}

