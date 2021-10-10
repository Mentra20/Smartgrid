import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailedConsumption } from 'src/models/detailed-consumption';
import { Between, Repository } from 'typeorm';
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
        this.http.post("http://consumption-db:3009/push-house-consumption", {param:message}).subscribe(
            {
                next: (value) => console.log("client consumption send to ConsumptionDB") , 
                error: (error) => console.log(error)
            }
        )
    }

    public getDetailedConsumptionByDate(houseID:string, consumptionDate:Date, objectName:string){
        return this.detailedConsumptionRepository.findOne({where:{houseID:houseID, consumptionDate: Between(new Date(consumptionDate.getTime()-1000),new Date(consumptionDate.getTime()+1000)), objectName:objectName}});
    }
}
