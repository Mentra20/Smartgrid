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

    public pushBatteryState(batteryState:{id_battery:string,id_producer:string,current_storage:number,date:Date}){
        this.logger.debug("I emit battery state : "+JSON.stringify(batteryState));
        this.client.emit('battery.state',batteryState);
    }

    public pushBatterySubscription(battery:{id_battery:string,id_producer:string,capacity:number,max_production_flow:number,max_storage_flow:number}){
        this.logger.debug("I emit battery Subscription : "+JSON.stringify(battery));
        this.client.emit('battery.subscription',battery);
    }
}
