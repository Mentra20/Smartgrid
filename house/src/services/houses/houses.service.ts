import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { response } from 'express';
import { firstValueFrom } from 'rxjs';
import { House } from 'src/models/house';
import { ScheduledHouseObject } from 'src/models/house-object';

@Injectable()
export class HousesService {
    private URL_PUSH_CONSUMPTION = "http://consumption-manager:3008/add-detailed-consumption"
    private URL_TIME_SLOT = "http://scheduler:3008/schedule"
    private URL_REGISTER_NEW_HOUSE = "http://registry-manager:3008/subscription"
    private allHouse:Map<string,House> = new Map();
    private currentDate : Date;

    constructor(private http:HttpService){}


    doTick(date:Date){
        this.currentDate = date;
        this.pushAllHouseConsumption();
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
                jsonHouseDetailed.push({idHouse:house.getHouseId(),dateConsumption:this.currentDate,objectName:object.getName(),consumption:object.getCurrentConsumption(this.currentDate)})
            }
        }
        this.http.post(this.URL_PUSH_CONSUMPTION,{param:jsonHouseDetailed}).subscribe({
            next : (response)=> console.log(response),
            error : (error)=> console.error(error),
        }
        );
    }

    public pushAllHouseConsumption(){
        for(let houseEntry of this.allHouse){
            this.pushConsumption(houseEntry[1])
        }
    }


    public async registryNewClient(clientName:string):Promise<string>{
        return (await firstValueFrom(this.http.post(this.URL_REGISTER_NEW_HOUSE, { client_name: clientName }))).data
    }

    public async addNewHouse(clientName:string):Promise<string>{
        var clientId= await this.registryNewClient(clientName);
        var newHouse = new House(clientName,clientId);
        this.allHouse.set(clientId,newHouse)
        return clientId;

    }

    public async requestTimeSLot(object: ScheduledHouseObject):Promise<any>{
        var timeSlot:{start:string,end:string} = await firstValueFrom(this.http.get(this.URL_TIME_SLOT,{params:{time:object.getTimeChargeNeed(),consumption:object.getMaxConsumption()}})).then((response)=>response.data)
        object.getTimeSlot().addSlots(new Date(timeSlot.start),new Date(timeSlot.end))
        return timeSlot;
    }

    public getHouse(clientId:string):House{
        return this.allHouse.get(clientId);

    }
}

