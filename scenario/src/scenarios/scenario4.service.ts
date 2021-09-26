import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class Scenario4Service {

    constructor(private http:HttpService){
        this.URL = "http://house-object:3005/consumption";
    }

    URL:string;
    consumeDate:Date = new Date('2021-11-02T02:00');
    notConsumeDate:Date = new Date('2021-11-01T12:00');

        async LaunchScenario(){
        await this.dateWhereHouseObjectConsume();
        console.log("\n");
        await this.dateWhereHouseObjectNotConsume();
    }

    async callToAPI(date:Date){
        await firstValueFrom(this.http.get(this.URL,{params:{date:date.toJSON()}})).then((body)=>{
            var consumption = body.data;
            console.log("A la date du "+date.toUTCString()+" mon objet consomme "+consumption);
        })
    }

    async dateWhereHouseObjectConsume(){
        console.log("CAS 1 : mon objet consomme à cette date : ");
        await this.callToAPI(this.consumeDate);
    }

    async dateWhereHouseObjectNotConsume(){
        console.log("CAS 2 : mon objet ne consomme pas à cette date : ");
        await this.callToAPI(this.notConsumeDate);
    }
}
