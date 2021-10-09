import { TimeSlots, TimeSlotsList } from "./time-slots";

export abstract class AbstractHouseObject {
    constructor(
        private name:string
        ){}

    public abstract getConsumption(date:Date);

    public getName(){
        return this.name;
    }

    public abstract setConsumption(consumption:number);

    public abstract setEnabled(enabled: boolean);

}
export class BasicHouseObject extends AbstractHouseObject{
    private enbled = true;

    constructor(name: string,private consumption:number){
        super(name)
    }

    public setEnabled(isEnabled: boolean) {
        this.enbled=isEnabled
    }

    public getConsumption(date: Date) {
        return this.enbled? this.consumption:0;
    }

    public setConsumption(consumption: number) {
        return this.consumption = consumption;
    }

}

export class ScheduledHouseObject extends AbstractHouseObject{
    
    private timeChargeNeed:number;

    constructor(name: string,private consumption:number){
        super(name)
    }


    public setEnabled(isEnabled: boolean) {
    }

    public getConsumption(date: Date) {
        return this.consumption;
    }

    public setConsumption(consumption: number) {
        return this.consumption = consumption;
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


