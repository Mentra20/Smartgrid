import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Battery } from 'src/models/battery';
import { House } from 'src/models/house';
import { ScheduledHouseObject } from 'src/models/house-object';

@Injectable()
export class HousesService {
    private logger = new Logger(HousesService.name)

    private URL_PUSH_CONSUMPTION = "http://consumption-provider:3012/add-detailed-consumption"
    private URL_PUSH_PRODUCTION = "http://production-provider:3006/add-production"
    private URL_BATTERY_STATE = "http://battery-provider:3017/battery-state"
    private URL_BATTERY_SUBSCRIBTION = "http://battery-provider:3017/battery-subscription"



    private URL_TIME_SLOT = "http://consumption-scheduler:3002/schedule"
    private URL_REGISTER_NEW_HOUSE = "http://registry-manager:3003/subscription/clientSubscribe"
    private URL_REGISTER_NEW_PRODUCER = "http://registry-manager:3003/subscription/clientBecomeProducer"

    private allHouse:Map<string,House> = new Map();
    private currentDate : Date;

    constructor(private http:HttpService){}


    doTick(date:Date){
        this.currentDate = date;
        this.pushAllHouseConsumption();
        this.pushAllHouseProduction();
        this.pushAllBatteryState();
    }
    doTickForAllHouse(){
        for(let houseEntry of this.allHouse){
            this.doTickForHouse(houseEntry[1])
        }
    }

    doTickForHouse(house:House){
        
    }

    generateConsumptionArray(house:House){
        var jsonHouseDetailed = [];
        for(let object of house.getAllObject()){
            var consumption = object.getCurrentConsumption(this.currentDate)
            if(consumption>0){
                jsonHouseDetailed.push({objectName:object.getName(),consumption:consumption})
            }
        }
        return jsonHouseDetailed;
    }

    calculeProductionHouse(house:House){
        var production = 0;
        for(let object of house.getAllObject()){
            var consumption = object.getCurrentConsumption(this.currentDate)
            if(consumption<0){
                production+= -consumption;
            }
        }
        return production;
    }

    useBattery(house:House,totalProduction:number,totalConsumption:number){
        var margeProduction = totalConsumption-totalProduction;
        var batteryUse = []
        if(margeProduction>0){
            //TODO modifier
            for(var battery of house.getAllBattery()){
                var chargeStore =battery.chargeBattery(margeProduction);
                batteryUse.push({battery,consumption:chargeStore})
                margeProduction-=chargeStore
            }
        }
        else if(margeProduction<0){
            //TODO modifier
            for(var battery of house.getAllBattery()){
                var chargeUse =battery.useChargeOfBattery(margeProduction);
                batteryUse.push({battery,production:-chargeUse})
                margeProduction+=chargeUse
            }
        }
        else{
            batteryUse.push()
        }
    }

    getTotalConsumption(houseID:string){
        return this.allHouse.get(houseID)?.getTotalConsumption(this.currentDate);
    }

    getAllConsumption(houseID:string){
        var currentHouse = this.allHouse.get(houseID);
        currentHouse.getAllObject();

    }

    async pushConsumption(house:House){
        var jsonHouseDetailed = [];
        for(let object of house.getAllObject()){
            var consumption = object.getCurrentConsumption(this.currentDate)
            if(consumption>0){
                jsonHouseDetailed.push({objectName:object.getName(),consumption:consumption})
            }
        }
        console.log(`PUSH to ${this.URL_PUSH_CONSUMPTION}: ${JSON.stringify({param:jsonHouseDetailed})}`)
        this.http.post(this.URL_PUSH_CONSUMPTION,{detailedConsumptions:{houseID:house.getHouseId(),consumptionDate:this.currentDate,object:jsonHouseDetailed}}).subscribe({
            next : (response)=> console.log(response.data),
            error : (error)=> console.error("error"),
        }
        );
    }

    public pushAllHouseConsumption(){
        for(let houseEntry of this.allHouse){
            this.pushConsumption(houseEntry[1])
        }
    }

    async pushProduction(house:House){
        var production = 0;
        for(let object of house.getAllObject()){
            var consumption = object.getCurrentConsumption(this.currentDate)
            if(consumption<0){
                production+= -consumption;
            }
        }
        if(production>0){

        }
    }

    public pushAllBatteryState(){
        for(let houseEntry of this.allHouse){
            this.pushBatteryStateOfHouse(houseEntry[1])
        }
    }
    
    private pushBatteryStateOfHouse(house:House){
        for(var battery of house.getAllBattery()||[]){
            this.pushBatteryState(battery,house.getProducerId())
        }

    }
    private pushBatteryState(battery:Battery,producerId:string){
        this.http.post(this.URL_BATTERY_STATE,
            {
            id_battery:battery.batteryID,
            id_producer:producerId,
            current_storage:battery.currentStorageWH,
            date:this.currentDate
            }
        ).subscribe({
            next : (response)=> this.logger.log(response),
            error : (error)=> this.logger.error(error),
        }
        );
    }

    public pushAllHouseProduction(){
        for(let houseEntry of this.allHouse){
            if(houseEntry[1].getProducerId()){
                this.pushProduction(houseEntry[1])
            }
        }
    }

    public async registerNewBattery(battery:Battery,producerId:string){
        this.logger.debug(`register new battery for producerId ${producerId} : ${battery} `)
        this.http.post(this.URL_BATTERY_SUBSCRIBTION, { 
            id_producer:producerId,
            battery: {
                id_battery:battery.batteryID,
                id_producer:producerId, 
                capacity:battery.capacityWH,
                max_production_flow:battery.maxProductionFlowW,
                max_storage_flow:battery.maxStorageFlowW
            }
        }).subscribe({         
            next : (response)=> this.logger.log(response),
            error : (error)=> this.logger.error(error)
        })
    }


    public async registryNewProducter(houseID:string):Promise<string>{
        console.log('client tring to become producer' + houseID);
        return (await firstValueFrom(this.http.post(this.URL_REGISTER_NEW_PRODUCER, { clientID: houseID }))).data
    }

    public async registryNewClient(clientName:string):Promise<string>{
        var response = (await firstValueFrom(this.http.post(this.URL_REGISTER_NEW_HOUSE, { clientName: clientName })));
        console.log(response.data);
        return response.data
    }


    public async requestTimeSLot(object: ScheduledHouseObject):Promise<any>{
        var timeSlot:{start:string,end:string} = await firstValueFrom(this.http.get(this.URL_TIME_SLOT,{params:{consumptionTime:object.getTimeChargeNeed(),ID:undefined}})).then((response)=>response.data)
        object.getTimeSlot().addSlots(new Date(timeSlot.start),new Date(timeSlot.end))
        return timeSlot;
    }

    public getHouse(clientId:string):House{
        return this.allHouse.get(clientId);
    }
    public addHouse(house:House){
        return this.allHouse.set(house.getHouseId(),house);
    }

    public getCurrentDate():Date{
        return this.currentDate;
    }
}

