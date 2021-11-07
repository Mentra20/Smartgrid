import { TimeSlots, TimeSlotsList } from "./time-slots";

export abstract class AbstractHouseObject {
    protected name:string
    constructor(
        name:string
        ){
            this.name =name;
        }

    public isConsumptionObject(){return false;}
    public isProductionObject(){return false;}


    public getCurrentConsumption(date:Date){
        return 0
    }
    public getCurrentProduction(date:Date){
        return 0;
    }

    public getName(){
        return this.name;
    }

    public changeMaxConsumption(maxConsumption:number){};
    public changeMaxProduction(maxConsumption:number){};

    public getMaxConsumption(){return 0}
    public getMaxProduction(){return 0};


}
export class BasicHouseObject extends AbstractHouseObject{
    private enabled = true;
    private maxConsumption:number;
    private maxProduction:number;
    private _isConsumptionObject:boolean;
    private _isProductionObject:boolean;

    constructor(name: string,maxConsumption:number,maxProduction:number){
        super(name)
        this.maxConsumption = maxConsumption
        this.maxProduction = maxProduction
    }


    public setEnabled(isEnabled: boolean) {
        this.enabled=isEnabled
    }


    public getCurrentConsumption(date: Date) {
        return this.enabled? this.maxConsumption:0;
    }
    public getCurrentProduction(date: Date) {
        return this.enabled? this.maxProduction:0;
    }

    public getMaxConsumption() {
        return this.maxConsumption;
    }
    public changeMaxConsumption(maxConsumption: number) {
        return this.maxConsumption = maxConsumption;
    }

    public getMaxProduction() {
        return this.maxConsumption;
    }
    public changeMaxProduction(maxConsumption: number) {
        return this.maxConsumption = maxConsumption;
    }

    public isConsumptionObject(){return this._isConsumptionObject;}
    public isProductionObject(){return this._isProductionObject;}

    public static objectFromJson(json:any){
        if(json.name==undefined||json.name==""){throw Error(`name "${json.name}" not accepted`)}
        var maxProduction:number=json.maxProduction?+json.maxProduction:0
        var maxConsumption:number=json.maxConsumption?+json.maxConsumption:0
        var object = new this(json.name,maxConsumption,maxProduction)
        object._isConsumptionObject=json.isConsumptionObject||maxConsumption>0;
        object._isProductionObject=json.isProductionObject||maxProduction>0;
        object.enabled=json.enabled||true
        return object
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


