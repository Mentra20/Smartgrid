import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { HouseConsumption } from 'src/models/house-consumption';
import { GlobalConsumptionService } from 'src/services/global-consumption/global-consumption.service';

@Controller('global-consumption')
export class GlobalConsumptionController {
    constructor(private readonly globalConsumptionService: GlobalConsumptionService,
        @Inject("GLOBAL_CONSUMPTION_DB") private client:ClientKafka) {
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf("consumption.client");
        await this.client.connect();
        console.log("Global consumption database connected to the bus.");
    }

    @MessagePattern("consumption.client") 
    addClientConsumptionToDB(@Payload() totalClientConsumptionMSG:any) {
        var totalClientConsumption:{
            houseID:string,
            consumptionDate:string,
            consumption:number
        }
        = totalClientConsumptionMSG.value;

        console.log("Global consumption database received the total client " + totalClientConsumption.houseID + " consumption from Kafka : " + JSON.stringify(totalClientConsumption));

        this.globalConsumptionService.addClientConsumptionToDB(totalClientConsumption);
    }

    @Get('get-total-consumption')
    async getTotalConsumption(@Query('date') date:string) {
        var consumptionSum = 0;
        var consumptionList:HouseConsumption[] = await this.globalConsumptionService.getTotalConsumptionByDate(new Date(date));

        console.log("[get-total-consumption][getTotalConsumption] Get date : " + new Date(date));
        
        for (var houseCons of consumptionList){
            consumptionSum += houseCons?.totalConsumption ||0;
        }
        console.log("Total consumption at date " + date + " is " + consumptionSum + " W.");
        return consumptionSum;
    }

    @Get('get-house-consumption')
    async getHouseConsumption(@Query('date') date:string, @Query('houseID') houseID:string) {

        var houseConsumption:HouseConsumption = await this.globalConsumptionService.getHouseConsumptionByDate(new Date(date),houseID);
        console.log("[get-house-consumption][getHouseConsumption] Get date : " + new Date(date) + " and house ID");

        console.log("House " + houseID + "consumption at date " + date + " is " + houseConsumption?.totalConsumption||0 + " W.");

        return houseConsumption;
    }

    @Get('get-community-consumption')
    async getCommunityConsumption(@Query('date') dateStr:string, @Query('housesID') housesID:any[]) {
        var date = new Date(dateStr);
        console.log("[get-community-consumption][getCommunityConsumption] Get date : " + date + " and houses ID " + housesID);
        var communitySum = 0;
        
        for (var houseID of housesID){
            var houseConsumption:HouseConsumption = await this.globalConsumptionService.getHouseConsumptionByDate(date,houseID);
            communitySum += houseConsumption?.totalConsumption||0;
        }

        var houseConsumption:HouseConsumption = await this.globalConsumptionService.getHouseConsumptionByDate(date,houseID);

        console.log("Community consumption at date " + date + " is " + communitySum + " W.");

        return communitySum;
    }
}
