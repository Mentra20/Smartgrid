import { Body, Controller, Logger, Post } from '@nestjs/common';
import { BatteryProviderService } from './battery-provider.service';

@Controller()
export class PushBatteryProviderController {
    logger = new Logger(PushBatteryProviderController.name)

    constructor(private batteryProviderService:BatteryProviderService){

    }

    @Post("battery-state")
    batteryState(@Body("producerID") producerID:string,@Body("battery") battery:any,@Body("date") date:string){
        this.batteryProviderService.pushBatteryState({
            id_battery:battery.id_battery,
            id_producer:producerID,
            current_storage:+battery.current_storage,
            date:new Date(date)
        })
    }

    @Post("battery-subscription")
    batterySubscription(@Body("producerID") producerID:string,@Body("battery") battery:any){
        this.batteryProviderService.pushBatterySubscription(
            {
                id_battery:battery.id_battery,
                id_producer:producerID,
                capacity:battery.capacity,
                max_production_flow:battery.max_production_flow,
                max_storage_flow:battery.max_storage_flow
            })
    }
}
