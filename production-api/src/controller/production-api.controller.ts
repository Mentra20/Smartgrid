import { Controller, Get, Query } from '@nestjs/common';
import { ProductionApiService } from 'src/service/production-api.service';
@Controller()
export class ProductionApiController {
    constructor(
    private readonly productionAPIService: ProductionApiService,
  ) {}

  @Get('total-production')
  async getTotalProduction(@Query('date') date:string):Promise<number> {
    var totalProd = await this.productionAPIService.getTotalProduction(date);
    console.log("Get total production : "+totalProd + " W.");
    return totalProd;
  }

  @Get('detailed-production')
  async getDetailedProduction(@Query('date') date:string,@Query('producerID') producerID:string):Promise<number> {
    var detailedProd = await this.productionAPIService.getDetailedProduction(date,producerID);
    console.log("Get detailed production : "+detailedProd);
    return detailedProd;
  }
  @Get('daily-production') 
  async getDailyProduction(@Query('producerID') producerID:string,@Query('productionDate') productionDate:string):Promise<number> {
    var dailyProd = await this.productionAPIService.getDailyProduction(producerID,productionDate);
    console.log("Get daily production : "+dailyProd);
    return dailyProd;
  }
  @Get('period-production') 
  async getPeriodProduction(@Query('producerID') producerID:string,@Query('begin') begin:string,@Query('end') end:string):Promise<number> {
    var periodProd = await this.productionAPIService.getPeriodProduction(producerID,begin,end);
    console.log("Get period production : "+periodProd);
    return periodProd;
  }

}

