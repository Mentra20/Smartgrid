import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HouseConsumption } from 'src/models/house-consumption';
import { ConsumptionService } from 'src/services/consumption/consumption.service';

@Controller('/')
export class ConsumptionController {
    
    constructor(private consumptionService:ConsumptionService){}

    @Post('push-house-consumption')
    pushHouseConsumption(
        @Body("param") houseConsumptionReceived:{
            houseID:string, 
            consumptionDate:Date, 
            consumption:number})
    {
        console.log("[consumption-db/push-house-consumption][pushHouseConsumption] houseConsumption:any "+ houseConsumptionReceived +" => void")
        console.log("new house consumption")

        var houseConsumption = new HouseConsumption();
        houseConsumption.houseID = houseConsumptionReceived.houseID;
        houseConsumption.consumptionDate = houseConsumptionReceived.consumptionDate;
        houseConsumption.consumption = houseConsumptionReceived.consumption;

        this.consumptionService.addHouseConsumptionToDB(houseConsumption);

        console.log("new house consumption added")
    }

    @Get('get-total-consumption')
    async getTotalConsumption(@Query('date') date:Date) {
        var consumptionSum=0;
        var consumptionList:HouseConsumption[] = await this.consumptionService.getTotalConsumptionByDate(date);

        console.log("[get-total-consumption][getTotalConsumption] Get date : "+date.toDateString);
        
        for (var houseCons of consumptionList){
            consumptionSum+=houseCons.consumption;
        }
        console.log("Total consumption at date "+date+" is "+consumptionSum);
        return consumptionSum;
    }

    @Get('get-house-consumption')
    async getHouseConsumption(@Query('date') date:Date, @Query('houseID') houseID:string) {

        var houseConsumption:HouseConsumption = await this.consumptionService.getHouseConsumptionByDate(date,houseID);
        console.log("[get-house-consumption][getHouseConsumption] Get date : "+date.toDateString+" and house ID");

        console.log("house consumption of ID +"+houseID+" at date "+date+" is "+houseConsumption.consumption);

        return houseConsumption.consumption;
    }

    @Get('get-community-consumption')
    async getCommunityConsumption(@Query('date') date:Date, @Query('housesID') housesID:any[]) {
        console.log("[get-community-consumption][getCommunityConsumption] Get date : "+date.toDateString+" and houses ID "+housesID);
        var communitySum = 0;
        
        for (var houseID of housesID){
            var houseConsumption:HouseConsumption = await this.consumptionService.getHouseConsumptionByDate(date,houseID);
            communitySum +=houseConsumption.consumption;
        }

        var houseConsumption:HouseConsumption = await this.consumptionService.getHouseConsumptionByDate(date,houseID);

        console.log("community consumption at date "+date+" is "+communitySum);

        return communitySum;
    }
}
