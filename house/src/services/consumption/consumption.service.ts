import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ObjectManagerService } from '../object-manager/object-manager.service';
import { SubscribeService } from '../subscribe/subscribe.service';

@Injectable()
export class ConsumptionService {

    constructor(private http:HttpService ,private objectManagerService:ObjectManagerService) {
    }

    getTotalConsumption(date:Date): number{
        var totalConsumption = 0;
        this.objectManagerService.getAllHouseObject().forEach((object)=>{
            totalConsumption+=object.getConsumption(date)
        });
        return totalConsumption;
    }

    getDetailedConsumptuion(date:Date): any[]{
        var totalConsumptionDetailed = [];
        this.objectManagerService.getAllHouseObject().forEach((object)=>{
            totalConsumptionDetailed.push({name:object.getName(),consumption: object.getConsumption(date)})
        })
        return totalConsumptionDetailed;
    }

    getConsumptionByName(name:string,date:Date): number{
        return this.objectManagerService.getHouseObject(name)?.getConsumption(date) || 0;
    }


}

