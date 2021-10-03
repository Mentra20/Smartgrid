import { TimeSlots, TimeSlotsList } from "./time-slots";

export class HouseObject {
    
    constructor(
        protected name : string,
        protected consumptionTime: TimeSlotsList
        ){}

    public static fromJson(object:any){
        var name = object?.name;
        var consumptionTime = new TimeSlotsList();

        object?.consumptionTime?.timeSlots.forEach(el => {
            consumptionTime.addSlots(new Date(el.start),new Date(el.end),+el.consumption);
        });

        var houseObject = new HouseObject(name,consumptionTime);
        return houseObject;
    }

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


