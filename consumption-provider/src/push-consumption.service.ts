import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka} from '@nestjs/microservices';

@Injectable()
export class PushConsumptionService {
    
    constructor(@Inject("CONSUMPTION_PROVIDER") private client:ClientKafka){}

    async onModuleInit() {
        await this.client.connect();
        console.log("consumption-provider connected on bus")
    }

    public pushConsumptionToBus(detailedConsumptions:{
        houseID:string, 
        consumptionDate:string, 
        object:{objectName:string, consumption:number}[]})
    {
        console.log("I emit detailed consumption : "+detailedConsumptions);
        this.client.emit('consumption.raw.detailed',detailedConsumptions);
    }
}
