import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

const AVERAGE_FRAME_TIME_MIN = 1 //fenetre de 1 minute
const AVERAGE_FRAME_TIME_MS = AVERAGE_FRAME_TIME_MIN*60*1000;

@Injectable()
export class ElectricityFrameService {

    currentTick:Date;

    consumptionFrame:any[] = [];
    productionFrame:any[] = [];


    constructor (@Inject('CONSUMPTION_FRAME') private client:ClientKafka){}

    receiveConsumption(consumptionClient:{houseID:string,consumptionDate:Date,consumption:number}){
        this.currentTick=this.currentTick ||consumptionClient.consumptionDate;
        console.log()

        this.consumptionFrame.push({houseID: consumptionClient.houseID,consumptionDate:consumptionClient.consumptionDate,consumption: consumptionClient.consumption/AVERAGE_FRAME_TIME_MIN});
    }

    receiveProduction(productionProducer:{id_producer:string,productionDate:Date,production:number}){
        this.currentTick=this.currentTick ||productionProducer.productionDate;

        this.productionFrame.push({id_producer:productionProducer.id_producer,production:productionProducer.production/AVERAGE_FRAME_TIME_MIN,productionDate:productionProducer.productionDate});
    }

    doTick(date:Date){
        this.currentTick = date;
        this.clearFrame();
        this.consumptionAdapt();
    }


    private consumptionAdapt(){
        var consumptionFrameTotal = this.consumptionFrame;
        var productionFrameTotal = this.productionFrame;
        for(var i in consumptionFrameTotal){
            consumptionFrameTotal[i].consumption =  consumptionFrameTotal[i].consumption
        }
        for(var i in productionFrameTotal){
            productionFrameTotal[i].consumption =  productionFrameTotal[i].consumption
        }
        var startDateFrame = new Date(this.currentTick.getTime()-AVERAGE_FRAME_TIME_MS);
        var endDateFrame = new Date(this.currentTick.getTime());
        console.log("send new frame "+JSON.stringify({consumptionFrameTotal,productionFrameTotal,startDateFrame,endDateFrame}))

        this.client.emit('electricity.frame',{consumptionFrameTotal,productionFrameTotal,startDateFrame,endDateFrame})
    }

    private clearFrame(){
        this.consumptionFrame=this.consumptionFrame.filter((elt)=>elt.consumptionDate.getTime()>this.currentTick.getTime()-AVERAGE_FRAME_TIME_MS)
        this.productionFrame=this.productionFrame.filter((elt)=>elt.productionDate.getTime()>this.currentTick.getTime()-AVERAGE_FRAME_TIME_MS)
    }





    

    

}
