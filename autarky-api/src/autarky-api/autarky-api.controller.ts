import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AutarkyApiController {

    constructor(private http:HttpService){}

    URL_REAL_ENERGY_OUTPUT = "http://real-energy-output:3030/realEnergyOutput/";

    @Get('get-house-autarky')
    async getHouseRealEnergyOutput(
      @Query('date') date: string,
      @Query('clientID') clientID: string,
    ) {
        console.log("[get-house-autarky] date:"+date+", clientID:"+clientID)
        return (await firstValueFrom(this.http.get(this.URL_REAL_ENERGY_OUTPUT+"get-house-real-energy-output", {params:{ clientID: clientID, date:date }}))).data
    }
  
    @Get('get-community-autarky')
    async getCommunityRealEnergyOutput(
      @Query('date') dateStr: string,
      @Query('communityID') communityID: number,
    ) {
        console.log("[get-community-autarky] date:"+dateStr+", communityID:"+communityID)
        return (await firstValueFrom(this.http.get(this.URL_REAL_ENERGY_OUTPUT+"get-community-real-energy-output", {params:{ communityID: communityID, date:dateStr}}))).data
    }
}
