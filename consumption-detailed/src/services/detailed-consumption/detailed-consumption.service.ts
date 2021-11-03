import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailedConsumption } from 'src/models/detailed-consumption';
import { Repository } from 'typeorm';


@Injectable()
export class DetailedConsumptionService {

    constructor(
        @InjectRepository(DetailedConsumption)
        private detailedConsumptionRepository: Repository<DetailedConsumption>,
    ){}

    public async storeAllDetailedConsumptionInDB(detailedConsumptions:{
        houseID:string, 
        consumptionDate:string, 
        object:{objectName:string, consumption:number}[]
    }){
        var houseID = detailedConsumptions.houseID;
        var consumptionDate = detailedConsumptions.consumptionDate;

        for(let detailedCons of detailedConsumptions.object){

            var detailedConsumptionDB = new DetailedConsumption();
            detailedConsumptionDB.houseID = houseID;
            detailedConsumptionDB.consumptionDate = new Date(consumptionDate);

            detailedConsumptionDB.objectName = detailedCons.objectName;
            detailedConsumptionDB.consumption = detailedCons.consumption;

            await this.addDetailedConsumptionInDB(detailedConsumptionDB);
            console.log("new detailed consumption added : "+JSON.stringify(detailedConsumptionDB))
        }
    }

    public addDetailedConsumptionInDB(detailedConsumption:DetailedConsumption){
        this.detailedConsumptionRepository.save(detailedConsumption);
    }

    public async getDetailedConsumptionByDate(houseID:string, consumptionDate:Date, objectName:string){
        return await this.detailedConsumptionRepository.findOne({where:
            {
                houseID:houseID, 
                consumptionDate: consumptionDate, 
                objectName:objectName
            }});
    }

    public async getAllDetailedConsumptionByDate(houseID:string, consumptionDate:Date){
        return await this.detailedConsumptionRepository.find({where:
            {
                houseID:houseID, 
                consumptionDate: consumptionDate, 
            }});
    }
}
