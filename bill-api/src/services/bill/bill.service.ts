import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Client } from 'src/models/client';
import { ClientBill } from 'src/models/client-bill';
import { DailyRealEnergy } from 'src/models/daily-real-energy';
import { Repository } from 'typeorm';

const URL_PERIOD_ENERGY = "http://daily-real-energy-output:3020/daily-real-energy-output/period-real-energy-output"
const URL_HOUSE_PRODUCER_ID = "http://client-database:3004/client-registry/house"
const URL_ALL_HOUSE = "http://client-database:3004/client-registry/allHouses"

@Injectable()
export class BillService {
    private productionPriceWH = 0.00010
    private consumptionPriceWH = 0.00015

    constructor(private http:HttpService,@InjectRepository(ClientBill) private clientBillRepository:Repository<ClientBill>){}

    private getMonthEnergy(id_client:string,year:number,month:number):Promise<DailyRealEnergy[]>{
        var params = {id_client,begin:new Date(year,month-1),end:new Date(year,month,0,0,0,0,-1)}
        console.log("[bill-api][BillService][getMonthEnergy] "+JSON.stringify(params))
        return firstValueFrom(this.http.get(URL_PERIOD_ENERGY,{params})).then((response)=>response.data)
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
            var energy = await this.getMonthEnergy(client.id, year, month);
            var production = this.calculateProduction(energy);
            var consumption = this.calculateConsumption(energy);
            bill = new ClientBill(client.id, year, month, consumption||0, production||0)
            bill.calculeBill(this.productionPriceWH,this.consumptionPriceWH)
        }
        return bill;
    }

    public getHouseRegistry(houseID:string):Promise<Client>{
        return firstValueFrom(this.http.get(URL_HOUSE_PRODUCER_ID,{params:{houseID}})).then((response)=>Object.assign(Client,response.data)).catch((error)=>{console.error(error),undefined})
    }

    private calculateProduction(energy: DailyRealEnergy[]): number {
        var totalProduction = 0; //W/H
        for (let dailyEnergy of energy) {
            if (dailyEnergy.energy >= 0 ) {
                totalProduction += dailyEnergy.energy;
            }
        }

        console.log("Return montly production : " + totalProduction);
        return totalProduction;
    }

    private calculateConsumption(energy: DailyRealEnergy[]): number {
        var totalConsumption = 0; //W/H
        for (let dailyEnergy of energy) {
            if (dailyEnergy.energy <= 0 ) {
                totalConsumption += +dailyEnergy.energy;
            }
        }

        console.log("Return montly consumption : " + totalConsumption);
        return totalConsumption;
    }

}

