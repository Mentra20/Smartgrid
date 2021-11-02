import { Body, Controller, Logger, Post } from '@nestjs/common';
import { BatteryProviderService } from './battery-provider.service';

@Controller()
export class PushBatteryProviderController {
    logger = new Logger(PushBatteryProviderController.name)

    constructor(private batteryProviderService:BatteryProviderService){

    }

    @Post("battery-sate")
    batteryState(@Body() body:any){
        this.batteryProviderService.pushBatteryState({id_battery:body.id_battery,id_producer:body.id_producer,current_storage:body.current_storage})
    }

    @Post("battery-subscription")
    batterySubscription(@Body() body:any){
        this.batteryProviderService.pushBatterySubscription({id_battery:body.id_battery,id_producer:body.id_producer,capacity:body.capacity,
            max_production_flow:body.max_production_flow,max_storage_flow:body.max_storage_flow})
    }
}
