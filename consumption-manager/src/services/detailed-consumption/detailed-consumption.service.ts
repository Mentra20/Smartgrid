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

    public addDetailedConsumptionToDB(detailedConsumption:DetailedConsumption){
        this.detailedConsumptionRepository.save(detailedConsumption);
    }
}
