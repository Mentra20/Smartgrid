import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HouseConsumption } from 'src/models/house-consumption';
import { Repository } from 'typeorm';

@Injectable()
export class ConsumptionService {

    constructor(
        @InjectRepository(HouseConsumption)
        private houseConsumptionRepository: Repository<HouseConsumption>){}

    public addHouseConsumptionToDB(houseConsumption:HouseConsumption){
        this.houseConsumptionRepository.save(houseConsumption);
    }

    public getTotalConsumptionByDate(date:Date){
        return this.houseConsumptionRepository.find({where:{consumptionDate:date}});
    }

    public getHouseConsumptionByDate(date:Date,houseID:string){
        //It's unique
        return this.houseConsumptionRepository.findOne({where:{houseID:houseID,consumptionDate:date}});
    }
}
