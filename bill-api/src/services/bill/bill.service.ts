import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import e from 'express';
import { firstValueFrom } from 'rxjs';
import { Client } from 'src/models/client';
import { ClientBill } from 'src/models/client-bill';

const URL_MONTH_PRODUCTION = "http://daily-production-db:3014/daily-production/period-production"
const URL_MONTH_CONSUMPTION = "http://daily-consumption-db:3013/daily-consumption/period-consumption"
const URL_HOUSE_PRODUCER_ID = "http://client-database:3004/client-registry/house"

@Injectable()
export class BillService {
    private productionPrice = 0.10
    private consumptionPrice = 0.15

    constructor(private http:HttpService){}

    private getMonthProduction(producerID:string,year:number,month:number): Promise<number>{
        var params = {producerID,start:new Date(year,month-1),end:new Date(year,month,0,0,0,0,-1)}
        console.log("[bill-api][BillService][getMonthProduction] "+JSON.stringify(params))
        return firstValueFrom(this.http.get(URL_MONTH_PRODUCTION,{params})).then((response)=>response.data)

    }

    private getMonthConsumption(houseID:string,year:number,month:number):Promise<number>{
        var params = {houseID,start:new Date(year,month-1),end:new Date(year,month,0,0,0,0,-1)}
        console.log("[bill-api][BillService][getMonthConsumption] "+JSON.stringify(params))
        return firstValueFrom(this.http.get(URL_MONTH_CONSUMPTION)).then((response)=>response.data)
    } 


    private async createBillForClient(houseID:string,year:number,month:number){
        var client = await this.getHouseRegistry(houseID);
        var bill;
        if(client){
            var production
            var consumption
            if(client.id_producer){
                production = this.getMonthProduction(houseID,year,month)
            }
            consumption = this.getMonthConsumption(houseID,year,month)
            Promise.all([consumption,production])
            bill = new ClientBill(houseID,consumption||0,production||0)
            bill.calculeBill()
        }
        return bill
    }

    private getHouseRegistry(houseID:string):Promise<Client>{
        return firstValueFrom(this.http.get(URL_HOUSE_PRODUCER_ID,{params:{houseID}})).then((response)=>Object.assign(Client,response.data)).catch((error)=>{console.error(error),undefined})
    }


}
