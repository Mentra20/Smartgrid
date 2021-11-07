import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HouseConsumption } from 'src/models/house-consumption';
import { Repository } from 'typeorm';

@Injectable()
export class GlobalConsumptionService {   
    constructor(
        @InjectRepository(HouseConsumption)
        private houseConsumptionRepository: Repository<HouseConsumption>){}

    public async addClientConsumptionToDB(totalClientConsumption: any) {
        let houseConsumption = new HouseConsumption();
        houseConsumption.houseID = totalClientConsumption.houseID;
        houseConsumption.consumptionDate = totalClientConsumption.consumptionDate;
        houseConsumption.totalConsumption = +totalClientConsumption.consumption;

        await this.houseConsumptionRepository.save(houseConsumption);
        console.log("Client " + houseConsumption.houseID + " had a consumption of " + houseConsumption.totalConsumption + " W the " + houseConsumption.consumptionDate + ".");
    }

    public getTotalConsumptionByDate(date:Date){
        return this.houseConsumptionRepository.find({where:{consumptionDate:date}});
    }

    public getHouseConsumptionByDate(date:Date,houseID:string){
        //It's unique
        return this.houseConsumptionRepository.findOne({where:{houseID:houseID,consumptionDate:date}});
    }
}
