import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class BatteryProviderService {
    logger = new Logger(BatteryProviderService.name)

    constructor(@Inject("BATTERY_PROVIDER") private client:ClientKafka){}

    async onModuleInit() {
        await this.client.connect();
        console.log("battery-provider connected on bus")
    }

    public pushBatteryState(batteryState:{producerID:string,capacity:number,current_storage:number,max_production_flow:number,max_storage_flow:number})
    {
        console.log("I emit battery state : "+JSON.stringify(batteryState));
        this.client.emit('battery.state',batteryState);
    }
}
