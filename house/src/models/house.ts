import { map } from "rxjs";
import { AbstractHouseObject } from "./house-object";

export class House {

    private allHouseObject:Map<string,AbstractHouseObject> = new Map();
    private producerId:string;

    constructor(private clientName:string,private houseId:string){
        this.allHouseObject = new Map();
    }

    public getHouseId():string{
        return this.houseId;
    }
    public getClientName():string{
        return this.clientName;
    }

    public getProducerId():string{
        return this.producerId;
    }
    public setProducerId(producerId:string){
        this.producerId = producerId;
    }

    public getObject(name:string):AbstractHouseObject{
        return this.allHouseObject.get(name);
    }

    public addHouseObject(object:AbstractHouseObject){
        this.allHouseObject.set(object.getName(),object);
    }

    public getHouseObject(name:string): AbstractHouseObject{
        return this.allHouseObject.get(name);
    }

    public getAllObject(): AbstractHouseObject[]{
        return Array.from(this.allHouseObject.values());
    }

    public getTotalConsumption(date:Date):number{
        var consumptionKW = 0
        for(let house of this.allHouseObject.values()){
            consumptionKW+=house.getCurrentConsumption(date);
        }
        return consumptionKW;
    }


}
