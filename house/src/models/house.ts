import { Logger } from "@nestjs/common";
import { map } from "rxjs";
import { Battery } from "./battery";
import { AbstractHouseObject } from "./house-object";

export class House {
    private logger = new Logger(House.name)

    private allHouseObject:Map<string,AbstractHouseObject> = new Map();
    private producerId:string;
    private batteryList:Battery[] = [];

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

    public addBattery(battery:Battery){
        this.batteryList.push(battery)
    }

    public getBattery(batteryID:string):Battery{
        for(let battery of this.batteryList){
            if(battery.batteryID==batteryID){
                return battery;
            }
        }
        return undefined;
    }

    public getAllBattery():Battery[]{
        return this.batteryList;
    }

    generateConsumptionArray(currentDate:Date){
        var jsonHouseDetailed = [];
        for(let object of this.getAllObject()){
            var consumption = object.getCurrentConsumption(currentDate)
            if(consumption>0){
                jsonHouseDetailed.push({objectName:object.getName(),consumption:consumption})
            }
        }
        return jsonHouseDetailed;
    }

    calculeProductionHouse(currentDate:Date){
        var production = 0;
        for(let object of this.getAllObject()){
            var consumption = object.getCurrentConsumption(currentDate)
            if(consumption<0){
                production+= -consumption;
            }
        }
        return production;
    }

    useBattery(totalProduction:number,totalConsumption:number){
        var margeProduction = totalProduction - totalConsumption;
        var batteryUse = []
        if(margeProduction>0){
            for(var battery of this.getAllBattery()){
                var chargeStore =battery.chargeBattery(margeProduction);
                batteryUse.push({name:battery.batteryName,consumption:chargeStore,production:0})
                margeProduction-=chargeStore
            }
        }
        else if(margeProduction<0){
            for(var battery of this.getAllBattery()){
                var chargeUse =battery.useChargeOfBattery(-margeProduction);
                batteryUse.push({name:battery.batteryName,production:chargeUse,consumption:0})
                margeProduction+=chargeUse
            }
        }
        else{
            batteryUse.push({name:battery.batteryName,production:0,consumption:0})
        }
        return batteryUse
    }

    getTotalProduction(currentDate:Date){
        var totalProduction = 0;
        for(let object of this.getAllObject()){
            if(!object.isProductionObject()){continue}

            var production = object.getCurrentProduction(currentDate)
            if(production>=0){
                totalProduction+= production;
            }
            else{
                this.logger.error("Consumption negative not allowned")
            }
            
        }
        return totalProduction
    }


}
