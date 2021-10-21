import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyConsumption } from 'src/models/daily-consumption';
import { Between, Repository } from 'typeorm';

@Injectable()
export class DailyConsumptionService {

    private tickNumberByHour:number = 60;

    constructor(
        @InjectRepository(DailyConsumption)
        private dailyConsumptionRepository: Repository<DailyConsumption>){}


    public async addClientConsumptionToDB(clientConsumption: {houseID:string,consumptionDate:string,consumption:number}) 
    {
        var dailyDate = new Date(new Date(clientConsumption.consumptionDate).setHours(0,0,0,0));//Only day
        var consumptionWH = this.convertWToWH(+clientConsumption.consumption);

        console.log("Add consumption "+consumptionWH+" W/H for client "+clientConsumption.houseID+ " at daily date "+dailyDate+".");

        var existingDailyConsumption = await this.getHouseConsumptionByDate(dailyDate,clientConsumption.houseID);

        if(existingDailyConsumption){//Existing line
            existingDailyConsumption.consumptionWH += consumptionWH;
            await this.dailyConsumptionRepository.save(existingDailyConsumption);

            console.log("Existing consumption is now : "+existingDailyConsumption.consumptionWH+"\n");
        }
        else{//New line
            var newDailyConsumption = new DailyConsumption();
            newDailyConsumption.houseID = clientConsumption.houseID;
            newDailyConsumption.dailyDate = dailyDate;
            newDailyConsumption.consumptionWH = consumptionWH;

            await this.dailyConsumptionRepository.save(newDailyConsumption);

            console.log("New daily consumption created.\n")
        }
    }

    public getHouseConsumptionByDate(date:Date,houseID:string){
        //It's unique
        return this.dailyConsumptionRepository.findOne({where:{houseID:houseID,dailyDate:date}});
    }

    public getHousePeriodConsumption(begin:Date,end:Date,houseID:string){
        return this.dailyConsumptionRepository.find({where:{houseID:houseID,dailyDate:Between(begin,end)}});
    }

    public convertWToWH(consumptionInW:number){
        return consumptionInW/this.tickNumberByHour;
    }
}
