import { TimeSlots, TimeSlotsList } from "./time-slots";

export abstract class AbstractHouseObject {
    constructor(
        private name:string
        ){}

    public abstract getCurrentConsumption(date:Date);

    public getName(){
        return this.name;
    }

    public abstract changeMaxConsumption(maxConsumption:number);
    public abstract getMaxConsumption();

}
export class BasicHouseObject extends AbstractHouseObject{
    private enbled = true;

    constructor(name: string,private maxConsumption:number){
        super(name)
    }


    public setEnabled(isEnabled: boolean) {
        this.enbled=isEnabled
    }


    public getCurrentConsumption(date: Date) {
        return this.enbled? this.maxConsumption:0;
    }


    public getMaxConsumption() {
        return this.maxConsumption;
    }
    public changeMaxConsumption(maxConsumption: number) {
        return this.maxConsumption = maxConsumption;
    }

}

export class ScheduledHouseObject extends AbstractHouseObject {
    
    private timeChargeNeed:number;
    private timeSlot:TimeSlotsList = new TimeSlotsList;

    constructor(name: string,private maxConsumption:number){
        super(name)
    }


    public getCurrentConsumption(date: Date) {
        if(this.timeSlot?.isConsump(date)){
            return this.maxConsumption;
        }
        return 0;
    }


    public changeMaxConsumption() {
        return this.maxConsumption;
    }
    public setMaxConsumption(maxConsumption: number) {
       return this.maxConsumption;
    }


    public setTimeChargeNeed(timeChargeNeed: number) {
        this.timeChargeNeed = timeChargeNeed;
    }
    public getTimeChargeNeed() {
        return this.timeChargeNeed;
    }

    public getTimeSlot():TimeSlotsList{
        return this.timeSlot;
    }

}
// export class HouseObject {
    
//     constructor(
//         protected name : string,
//         protected consumptionTime: TimeSlotsList
//         ){}

//     public static fromJson(object:any){
//         var name = object?.name;
//         var consumptionTime = new TimeSlotsList();

//         object?.consumptionTime?.timeSlots.forEach(el => {
//             consumptionTime.addSlots(new Date(el.start),new Date(el.end),+el.consumption);
//         });

//         var houseObject = new HouseObject(name,consumptionTime);
//         return houseObject;
//     }

//     public getConsumption(date:Date){
//         return this.consumptionTime.getConsumption(date);
//     }

//     public getName(){
//         return this.name;
//     }
// }

// export class HouseObjectScheduled extends HouseObject {
    
//     constructor(
//         name : string,
//         private consumption: number
//         ){
//             super(name,new TimeSlotsList());
//         }

//     public addSlotConsumption(start,end){
//         this.consumptionTime.addSlots(start,end,this.consumption);
//     }
    
//     public getChargeConsumption(){
//         return this.consumption;
//     }

// }


