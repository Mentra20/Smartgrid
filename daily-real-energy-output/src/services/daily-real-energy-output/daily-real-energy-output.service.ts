import { Injectable } from '@nestjs/common';
import { DailyRealEnergy } from 'src/models/DailyRealEnergy';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

@Injectable()
export class DailyRealEnergyOutputService {

    private tickNumberByHour:number = 60;

    constructor(
        @InjectRepository(DailyRealEnergy)
        private dailyRealEnergyRepository: Repository<DailyRealEnergy>){}

    async addClientDataToDB(clientRealDailyData: { id_client: string; id_producer: string; date: string; id_community: number; energy: number; }) {
        var dailyDate = new Date(new Date(clientRealDailyData.date).setHours(0,0,0,0)); //Only day
        var energyinWH = this.convertWToWH(clientRealDailyData.energy);

        console.log("Add energy " + clientRealDailyData.energy +" W/H for client " + clientRealDailyData.id_client + " at daily date " + dailyDate + ".");

        var existingRealDailyEnergy = await this.getClientDataByDate(dailyDate, clientRealDailyData.id_client, clientRealDailyData.id_producer);

        if(existingRealDailyEnergy){ //Existing line
            existingRealDailyEnergy.energy += energyinWH;
            await this.dailyRealEnergyRepository.save(existingRealDailyEnergy);

            console.log("Existing energy is now : " + existingRealDailyEnergy.energy + "\n");
        }
        else{ //New line
            var newRealDailyEnergy = new DailyRealEnergy();
            newRealDailyEnergy.id_client = clientRealDailyData.id_client;
            newRealDailyEnergy.id_producer = clientRealDailyData.id_producer;
            newRealDailyEnergy.dailyDate = dailyDate;
            newRealDailyEnergy.id_community = clientRealDailyData.id_community;
            newRealDailyEnergy.energy = energyinWH;

            await this.dailyRealEnergyRepository.save(newRealDailyEnergy);

            console.log("New daily real energy output created.\n")
        }
    }

    public getClientDataByDate(date:Date, id_client:string, id_producer:string): Promise<DailyRealEnergy> {
        return this.dailyRealEnergyRepository.findOne({where:{id_client:id_client, id_producer:id_producer, dailyDate:date}});
    }

    public getClientPeriodData(begin:Date, end:Date, id_client:string, id_producer:string): Promise<DailyRealEnergy[]> {
        return this.dailyRealEnergyRepository.find({where:{id_client:id_client, id_producer:id_producer, dailyDate:Between(begin,end)}});
    }

    public convertWToWH(energyInW:number): number{
        return energyInW/this.tickNumberByHour;
    }
}
