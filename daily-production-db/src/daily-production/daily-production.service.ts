import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyProduction } from 'src/models/daily-production';
import { Repository ,Between} from 'typeorm';

@Injectable()
export class DailyProductionService {

    private tickNumberByHour:number = 60;

    constructor(
        @InjectRepository(DailyProduction)
        private dailyProductionRepository: Repository<DailyProduction>){}


    public async addProductionToDB(production: {id_producer:string,productionDate:string,production:number}) 
    {
        var dailyDate = new Date(new Date(production.productionDate).setHours(0,0,0,0));//Only day
        var productionWH = this.convertWToWH(+production.production);

        console.log("Add production "+productionWH+" W/H for producer "+production.id_producer+ " at daily date "+dailyDate+".");

        var existingDailyProduction = await this.getDailyProductionByDate(dailyDate,production.id_producer);

        if(existingDailyProduction){//Existing line
            existingDailyProduction.productionWH += productionWH;
            await this.dailyProductionRepository.save(existingDailyProduction);

            console.log("Existing production is now : "+existingDailyProduction.productionWH+"\n");
        }
        else{//New line
            var newDailyProduction = new DailyProduction();
            newDailyProduction.id_producer = production.id_producer;
            newDailyProduction.dailyDate = dailyDate;
            newDailyProduction.productionWH = productionWH;

            await this.dailyProductionRepository.save(newDailyProduction);

            console.log("New daily production created.\n")
        }
    }

    public getDailyProductionByDate(date:Date,id_producer:string){
        //It's unique
        return this.dailyProductionRepository.findOne({where:{id_producer:id_producer,dailyDate:date}});
    }

    public convertWToWH(productionInW:number){
        return productionInW/this.tickNumberByHour;
    }
    public getPeriodProduction(begin:Date,end:Date,id_producer:string){

        return this.dailyProductionRepository.find({where:{id_producer:id_producer,dailyDate:Between(begin,end)}});
    }

}
