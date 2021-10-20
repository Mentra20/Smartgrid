import { Controller, Inject } from '@nestjs/common';
import { DailyConsumptionService } from './daily-consumption.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('daily-consumption')
export class DailyConsumptionController {

    constructor(private readonly dailyConsumptionService: DailyConsumptionService,
        @Inject("DAILY_CONSUMPTION_DB") private client:ClientKafka) {
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf("consumption.client");
        await this.client.connect();
        console.log("Daily Consumption DB connected to the bus.");
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

        this.dailyConsumptionService.addClientConsumptionToDB(totalClientConsumption);
    }
}
