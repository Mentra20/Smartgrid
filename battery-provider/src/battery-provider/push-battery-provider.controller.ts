import { Body, Controller, Logger, Post } from '@nestjs/common';
import { BatteryProviderService } from './battery-provider.service';

@Controller()
export class PushBatteryProviderController {
    logger = new Logger(PushBatteryProviderController.name)

    constructor(private batteryProviderService:BatteryProviderService){

    }

    @Post("battery-sate")
    batteryState(@Body() body:any){
        this.batteryProviderService.pushBatteryState(body)
    }
}
