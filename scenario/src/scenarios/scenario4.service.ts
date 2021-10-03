import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class Scenario4Service {

    constructor(private http:HttpService){
        this.URL = "http://house-object:3001/consumption";
    }

    URL:string;
    startDate:Date = new Date('2021-10-01T00:00');
    
    endDate:Date = new Date('2021-10-02T06:00');

        async LaunchScenario(){
        await this.houseObjectConsumption();
        console.log("\n");
    }

    async callToAPI(date:Date){
        await firstValueFrom(this.http.get(this.URL,{params:{date:date.toJSON()}})).then((body)=>{
            var objectName = body.data.objectName;
            var consumption = body.data.consumption;
            console.log("A la date du "+date.toString()+" mon objet \""+objectName+"\" consomme "+consumption);
        })
    }

    async houseObjectConsumption(){
        console.log("CAS 1 : mon objet consomme à cette date : ");
        var currentDate:Date = this.startDate;
        while(currentDate<this.endDate){
            await this.callToAPI(currentDate);
            currentDate.setHours(currentDate.getHours()+1);
        }
    }

}
