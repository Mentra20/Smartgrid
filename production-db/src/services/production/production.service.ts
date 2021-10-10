import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Production } from 'src/models/production';
import { Repository } from 'typeorm';

@Injectable()
export class ProductionService {

    constructor(
        @InjectRepository(Production)
        private productionRepository: Repository<Production>){}

    public addProductionToDB(production:Production){
        this.productionRepository.save(production);
    }
    public async getProductionByDate(date:Date):Promise<Production[]>{
        return this.productionRepository.find({where:{productionDate:date}});
    }
}
