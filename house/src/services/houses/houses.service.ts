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
        this.doTickForAllHouse()
    }
    doTickForAllHouse(){
        for(let houseEntry of this.allHouse){
            this.doTickForHouse(houseEntry[1])
        }
    }

    async doTickForHouse(house:House){
        var houseTotalConsumption = house.getTotalConsumption(this.currentDate);
        var houseTotalProduction = house.getTotalProduction(this.currentDate);
        var houseConsumptionDetailled = house.generateConsumptionArray(this.currentDate)
        var batteryUsage = house.useBattery(houseTotalProduction,houseTotalConsumption)

        batteryUsage.forEach((battery)=>houseConsumptionDetailled.push(battery))

        var batteryProduction = 0
        for(var battery of batteryUsage){
            batteryProduction+=battery.production
        }

        houseTotalProduction+=batteryProduction

        this.pushBatteryStateOfHouse(house)
        this.pushConsumption(house,houseConsumptionDetailled)
        if(house.getProducerId()!=undefined){
            this.pushProduction(house,houseTotalProduction)
        }

    }


    async pushConsumption(house:House,houseConsumptionDetailled:any){
        var message = {detailedConsumptions:{houseID:house.getHouseId(),consumptionDate:this.currentDate,object:houseConsumptionDetailled}}
        this.logger.debug(`[pushConsumption] params: ${JSON.stringify(message)}`)
        await this.http.post(this.URL_PUSH_CONSUMPTION,message).subscribe({
            error : (error)=> this.logger.error("error"),
        }
        );
    }

    async pushProduction(house:House,totalProduction:number){
        var message = {production:{id_producer:house.getProducerId(),productionDate:this.currentDate,production:totalProduction}}
        this.logger.debug(`[pushProduction] params: ${JSON.stringify(message)}`)

        await this.http.post(this.URL_PUSH_PRODUCTION,message).subscribe({
            error : (error)=> this.logger.error(error),
        })
    }

    
    private pushBatteryStateOfHouse(house:House){
        for(var battery of house.getAllBattery()||[]){
            this.pushBatteryState(battery,house.getProducerId())
        }
    }

    private pushBatteryState(battery:Battery,producerId:string){
        var message = {
            battery:{
                id_battery:battery.batteryID,
                current_storage:battery.currentStorageWH
            },
            producerID:producerId,
            date:this.currentDate
        };
        this.logger.debug(`[pushBatteryState] params : ${JSON.stringify(message)}`)
        this.http.post(this.URL_BATTERY_STATE,message).subscribe({
            error : (error)=> this.logger.error(error),
        }
        );
    }


    public async registerNewBattery(battery:Battery,producerId:string){
        this.logger.debug(`register new battery for producerId ${producerId} : ${battery} `)
        await this.http.post(this.URL_BATTERY_SUBSCRIBTION, { 
            id_producer:producerId,
            battery: {
                id_battery:battery.batteryID,
                id_producer:producerId, 
                capacity:battery.capacityWH,
                max_production_flow:battery.maxProductionFlowW,
                max_storage_flow:battery.maxStorageFlowW
            }
        }).subscribe({         
            error : (error)=> this.logger.error(error)
        })
    }


    public async registryNewProducter(houseID:string):Promise<string>{
        console.log('client tring to become producer' + houseID);
        return (await firstValueFrom(this.http.post(this.URL_REGISTER_NEW_PRODUCER, { clientID: houseID }))).data
    }

    public async registryNewClient(clientName:string, privacyDetailedData:boolean, privacyConsumptionData:boolean, privacyProductionData:boolean):Promise<string>{
        var message = {clientName: clientName, privacyDetailedData: privacyDetailedData, privacyConsumptionData: privacyConsumptionData, privacyProductionData: privacyProductionData};
        var response = (await firstValueFrom(this.http.post(this.URL_REGISTER_NEW_HOUSE, message)));
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

