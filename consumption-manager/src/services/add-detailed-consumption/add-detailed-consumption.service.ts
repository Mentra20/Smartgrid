import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailedConsumption } from 'src/models/detailed-consumption';
import { Repository } from 'typeorm';


@Injectable()
export class AddDetailedConsumptionService {

    constructor(
        @InjectRepository(DetailedConsumption)
        private detailedConsumptionRepository: Repository<DetailedConsumption>,
    ){}

    public addDetailedConsumptionToDB(ID:string, date:Date, objectName:string, consumption:number){

        var detailedConsumption = Object.assign(new DetailedConsumption(),{
            houseID:ID,
            consommationDate:date,
            objectName:objectName,
            consumption:consumption});
        
        this.detailedConsumptionRepository.save(detailedConsumption);
    }
}
