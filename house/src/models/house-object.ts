import { TimeSlots, TimeSlotsList } from "./time-slots";

export abstract class AbstractHouseObject {
    private name:string
    constructor(
        name:string
        ){
            this.name =name;
        }

    public abstract getCurrentConsumption(date:Date);

    public getName(){
        return this.name;
    }

    public abstract changeMaxConsumption(maxConsumption:number);
    public abstract getMaxConsumption();

}
export class BasicHouseObject extends AbstractHouseObject{
    private enabled = true;
    private maxConsumption:number;

    constructor(name: string,maxConsumption:number){
        super(name)
        this.maxConsumption = maxConsumption
    }


    public setEnabled(isEnabled: boolean) {
        this.enabled=isEnabled
    }


    public getCurrentConsumption(date: Date) {
        return this.enabled? this.maxConsumption:0;
    }


    public getMaxConsumption() {
        return this.maxConsumption;
    }
    public changeMaxConsumption(maxConsumption: number) {
        return this.maxConsumption = maxConsumption;
    }

}

export class ScheduledHouseObject extends AbstractHouseObject {
    
    private timeChargeNeed:number = 5;//5h par défaut
    private timeSlot:TimeSlotsList = new TimeSlotsList;
    protected maxConsumption:number

    constructor(name: string, maxConsumption:number){
        super(name)
        this.maxConsumption = maxConsumption;
    }


    public getCurrentConsumption(date: Date) {
        if(this.timeSlot?.isConsump(date)){
            return this.maxConsumption;
        }
        return 0;
    }


    public getMaxConsumption() {
        return this.maxConsumption;
    }
    public changeMaxConsumption(maxConsumption: number) {
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

    public removeCurrentTimeSlot(date:Date){
        this.timeSlot.removeTimeSlot(date);
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


