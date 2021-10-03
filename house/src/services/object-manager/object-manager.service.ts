import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HouseObject, HouseObjectScheduled } from 'src/models/house-object';
import { SubscribeService } from '../subscribe/subscribe.service';

@Injectable()
export class ObjectManagerService {
    private URL_SCHEDULER = "http://consumption-scheduler:3002/schedule";

    private houseObject= new Map<string, HouseObject>();

    constructor(private http: HttpService, private subscribeService:SubscribeService){}

    addHouseObject(object:HouseObject){
        console.log("new house object : "+object.getName())
        this.houseObject.set(object.getName(),object);
    }

    async addScheduledHouseObject(name:string,consumption:number){
        var objectScheduled = new HouseObjectScheduled(name,consumption);
        var schedule = await this.getSchedule(objectScheduled)
    }

    getHouseObject(name:string){
        return this.houseObject.get(name);
    }

    getAllHouseObjectName():string[]{
        return Array.from(this.houseObject.keys());
    }

    getAllHouseObject():HouseObject[]{
        console.log("im call: size = "+Array.from(this.houseObject.values()).length)
        return Array.from(this.houseObject.values());
    }

    private async getSchedule(objectScheduled:HouseObjectScheduled){

        await firstValueFrom(this.http.get(this.URL_SCHEDULER, { params: { ID: this.subscribeService.getSubscribeID() , consumption:objectScheduled.getChargeConsumption()}})).then((body) => {
            objectScheduled.addSlotConsumption(
                  new Date(body.data[0]),
                  new Date(body.data[1])
                );
        }).catch((err)=>console.log("cannot get schedule: "+err));
        this.addHouseObject(objectScheduled);

      }
}
