import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { House } from 'src/models/house';
import { ScheduledHouseObject } from 'src/models/house-object';

@Injectable()
export class HousesService {
    private URL_PUSH_CONSUMPTION = "http://consumption-provider:3012/add-detailed-consumption"
    private URL_PUSH_PRODUCTION = "http://production-provider:3006/add-production"

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
            this.http.post(this.URL_PUSH_PRODUCTION,{production:{id_producer:house.getProducerId(),productionDate:this.currentDate,production}}).subscribe({
                next : (response)=> console.log(response),
                error : (error)=> console.error(error),
            }
            );
        }
    }

    public pushAllHouseProduction(){
        for(let houseEntry of this.allHouse){
            if(houseEntry[1].getProducerId()){
                this.pushProduction(houseEntry[1])
            }
        }
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

