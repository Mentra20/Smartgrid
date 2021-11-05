import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { BatteryInfo } from 'src/models/battery-info';
import { BatteryState } from 'src/models/battery-state';
import { BatteryService } from './battery.service';

@Controller()
export class BatteryController {
    constructor(
        private batteryService: BatteryService,
        @Inject("BATTERY") private client:ClientKafka){}

    async onModuleInit() {
        this.client.subscribeToResponseOf("battery.subscription");
        this.client.subscribeToResponseOf("battery.state");

        await this.client.connect();

        console.log("battery connected on bus")
    }

    @MessagePattern("battery.subscription")
    async addNewBattery(@Payload() batteryInfoMSG:any){
        console.log("[battery][addNewBattery] batteryInfoMSG:any "+ batteryInfoMSG +" => void")

        var batteryReceived:{
            id_producer:string, 
            id_battery:string, 
            capacity:number,
            max_production_flow:number,
            max_storage_flow:number,
        }
        = batteryInfoMSG.value;

        await this.batteryService.addNewBatteryToDB(batteryReceived);
    }


    @MessagePattern("battery.state")
    async storedNewBatteryState(@Payload() batteryStateMSG:any){
        console.log("[battery][storedNewBatteryState] batteryStateMSG:any "+ batteryStateMSG +" => void")

        var batteryStateReceived:{
            id_producer:string, 
            id_battery:string, 
            date:string,
            current_storage:string,
        }
        = batteryStateMSG.value;

        await this.batteryService.storedNewBatteryStateInDB(batteryStateReceived);
    }

    @Get('get-battery-state')
    async getBatteryState(@Query('date') dateString:string, @Query('producerID') producerID:string, @Query('batteryID') batteryID:string) {
        console.log("[battery][getBatteryState] Get date : "+dateString+" and producer ID "+producerID+" and battery ID "+batteryID);
        var date = new Date(dateString);

        var batteryState:BatteryState = await this.batteryService.getBatteryState(date, producerID, batteryID);
        console.log("Get battery state : "+JSON.stringify(batteryState));

        return batteryState;
    }

    @Get('get-battery-info')
    async getBatteryInfo(@Query('producerID') producerID:string, @Query('batteryID') batteryID:string) {
        console.log("[battery][getBatteryInfo] Get producer ID "+producerID+" and battery ID "+batteryID);

        var batteryInfo:BatteryInfo = await this.batteryService.getBatteryInfo(producerID, batteryID);
        console.log("Get battery info : "+JSON.stringify(batteryInfo));

        return batteryInfo;
    }
}
