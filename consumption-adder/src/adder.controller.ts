import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';

@Controller('adder')
export class AdderController {

    constructor(@Inject("CONSUMPTION_ADDER") private client:ClientKafka)
    {}

    async onModuleInit() {
        this.client.subscribeToResponseOf("consumption.raw.detailed");
        await this.client.connect();

        console.log("Consumption-adder ready")
    }

    @MessagePattern("consumption.raw.detailed")
    withEmit(detailedConsumptions: 
        {
            houseID:string, 
            consumptionDate:string, 
            object:{objectName:string, consumption:number}[] 
        }) {

        //RECEIVED
        console.log("I receive the detailed consumption from kafka : "+ JSON.stringify(detailedConsumptions));

        var houseID = detailedConsumptions.houseID;
        var consumptionDate = detailedConsumptions.consumptionDate;

        var clientConsumptionSum = 0;
        for(let detailedCons of detailedConsumptions.object){

            clientConsumptionSum += detailedCons.consumption;
        }
        console.log("Consumption sum for houseID "+houseID+" at date "+consumptionDate+" is : "+clientConsumptionSum);


        //EMIT
        var message = {houseID, consumptionDate, consumption:clientConsumptionSum};
        console.log("I emit consumption sum : "+message);
        this.client.emit('consumption.client',message);
    }
}
