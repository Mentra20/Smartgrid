import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumptionPeakService } from './consumption-peak.service';

@Controller()
export class ConsumptionPeakController {

    constructor(@Inject("CONSUMPTION_PEAK") private client:ClientKafka,
        private consumptionPeakService:ConsumptionPeakService)
    {}

    async onModuleInit() {
        this.client.subscribeToResponseOf("electricity.frame");
        await this.client.connect();

        console.log("consumption-peak connected on bus")
    }

    @MessagePattern("electricity.frame")
    SumDetailedConsumption(@Payload() electricityFrame:any){
        var frame:{
            consumptionFrameTotal:{houseID:string,consumption:string}[],
            productionFrameTotal:any[],
            startDateFrame:string,
            endDateFrame:string}
        = electricityFrame.value;

        console.log("received frame :"+JSON.stringify(frame));
        
        this.consumptionPeakService.checkPeak(frame.consumptionFrameTotal);
    }
}
