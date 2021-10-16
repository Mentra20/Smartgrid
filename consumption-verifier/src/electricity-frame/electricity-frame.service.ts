import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

const AVERAGE_FRAME_TIME_MIN = 5 //fenetre de 5 minute
const AVERAGE_FRAME_TIME_MS = AVERAGE_FRAME_TIME_MIN*60*1000;

@Injectable()
export class ElectricityFrameService {

    currentTick:Date;

    consumptionFrame:any[] = [];
    productionFrame:any[] = [];
    startDateFrame:Date;

    constructor (@Inject('CONSUMPTION_FRAME') private client:ClientKafka){}

    receiveConsumption(consumptionClient:{houseID:string,consumptionDate:Date,consumption:number}){
        //si il arrive trop tard on lignore
        if(this.startDateFrame>consumptionClient.consumptionDate){
            console.log(`[ignore] consumption arrived too late: ${consumptionClient}`);
            return;
        }
        this.consumptionFrame.push({houseID: consumptionClient.houseID,consumption: consumptionClient.consumption});
    }

    receiveProduction(productionProducer:{id_producer:string,consumptionDate:Date,consumption:number}){
        //si il arrive trop tard on lignore
        if(this.startDateFrame>productionProducer.consumptionDate){
            console.log(`[ignore] production arrived too late: ${productionProducer}`);
            return;
        }
        this.productionFrame.push({id_producer:productionProducer.id_producer,consumption:productionProducer.consumption});
    }

    doTick(date:Date){
        this.currentTick = date;
        if(this.endFrame()){
            this.consumptionAdapt();
            this.resetFrame();
        }
    }

    endFrame():boolean{
        return this.currentTick.getTime()-this.startDateFrame.getTime()>AVERAGE_FRAME_TIME_MS;
    }

    private consumptionAdapt(){
        var consumptionFrameTotal = this.consumptionFrame;
        var productionFrameTotal = this.productionFrame;
        var startDateFrame = this.startDateFrame;
        var endDateFrame = new Date(this.startDateFrame.getTime()+AVERAGE_FRAME_TIME_MS);

        this.client.emit('electricity.frame',{consumptionFrameTotal,productionFrameTotal,startDateFrame,endDateFrame})
    }

    private resetFrame(){
        this.consumptionFrame = []
        this.productionFrame = []
        this.startDateFrame = this.currentTick;
    }





    

    

}
