import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailedConsumption } from 'src/models/detailed-consumption';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class DetailedConsumptionService {

    constructor(
        @InjectRepository(DetailedConsumption)
        private detailedConsumptionRepository: Repository<DetailedConsumption>,
        private http:HttpService
    ){}

    public addDetailedConsumptionToDB(detailedConsumption:DetailedConsumption){
        this.detailedConsumptionRepository.save(detailedConsumption);
    }

    public pushClientConsumption(houseID:string, consumptionDate:Date, clientConsumption:number){
    
        var message = {houseID:houseID, consumptionDate:consumptionDate,consumption:clientConsumption}
        this.http.post("http://URL_CONSUMPTION_DB:PORT/ROUTE", {param:message}).subscribe(
            {
                next: (value) => console.log("client consumption send to ConsumptionDB") , 
                error: (error) => console.log(error)
            }
        )
    }
}
