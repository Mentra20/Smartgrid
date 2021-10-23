import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { firstValueFrom } from 'rxjs';
import { Client } from 'src/models/client';
import { ClientBill } from 'src/models/client-bill';
import { Repository } from 'typeorm';

const URL_MONTH_PRODUCTION = "http://daily-production-db:3014/daily-production/period-production"
const URL_MONTH_CONSUMPTION = "http://daily-consumption-db:3013/daily-consumption/period-consumption"
const URL_HOUSE_PRODUCER_ID = "http://client-database:3004/client-registry/house"
const URL_ALL_HOUSE = "http://client-database:3004/client-registry/allHouses"

@Injectable()
export class BillService {
    private productionPrice = 0.10
    private consumptionPrice = 0.15

    constructor(private http:HttpService,@InjectRepository(ClientBill) private clientBillRepository:Repository<ClientBill>){}

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

    public async getBill(houseID:string,year:number,month:number){
        return this.clientBillRepository.findOne({where:{houseID,year,month}})
    }

    public async getAllBillForHouse(houseID:string){
        return this.clientBillRepository.find({where:{houseID}})
    }

    public async generateAllBill(year:number,month:number){
        var houses = await this.getAllHouse();
        for(var client of houses){
            var bill = await this.createBillForClient(client,year,month);
            if(bill){
                console.log("[bill-api][BillService][generateAllBill] save "+JSON.stringify(bill))
                this.clientBillRepository.save(bill)
            }
        }
    }

    private async getAllHouse():Promise<Client[]>{
        return firstValueFrom(this.http.get(URL_ALL_HOUSE))
        .then((response)=>{
            var allHouses:Client[] = [];
            for(var client of response.data){
                allHouses.push(Object.assign(Client,client));
            }
            return allHouses;
        }).catch((error)=>{console.error(error);return []})
    }


    public async createBillForClient(client:Client,year:number,month:number):Promise<ClientBill>{
        var bill;
        if(client){
            var production
            var consumption
            if(client.id_producer){
                production = this.getMonthProduction(client.id,year,month)
            }
            consumption = this.getMonthConsumption(client.id,year,month)
            Promise.all([consumption,production])
            bill = new ClientBill(client.id,year,month,consumption||0,production||0)
            bill.calculeBill()
        }
        return bill
    }

    public getHouseRegistry(houseID:string):Promise<Client>{
        return firstValueFrom(this.http.get(URL_HOUSE_PRODUCER_ID,{params:{houseID}})).then((response)=>Object.assign(Client,response.data)).catch((error)=>{console.error(error),undefined})
    }


}
