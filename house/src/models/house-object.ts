import { TimeSlots, TimeSlotsList } from "./time-slots";

export class HouseObject {
    
    constructor(
        protected name : string,
        protected consumptionTime: TimeSlotsList
        ){}

    public getConsumption(date:Date){
        return this.consumptionTime.getConsumption(date);
    }

    public getName(){
        return this.name;
    }
}

export class HouseObjectScheduled extends HouseObject {
    
    constructor(
        name : string,
        private consumption: number
        ){
            super(name,new TimeSlotsList());
        }

    public addSlotConsumption(start,end){
        this.consumptionTime.addSlots(start,end,this.consumption);
    }
    
    public getChargeConsumption(){
        return this.consumption;
    }

}


