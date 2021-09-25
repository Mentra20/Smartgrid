import { HttpService } from '@nestjs/axios';
import {Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class Scenario1Service {

    constructor(private http:HttpService){
        this.URL = "http://house:3000/consumption";
    }

    URL:string;
    consumeDate:Date = new Date('2021-10-02T02:00');
    notConsumeDate:Date = new Date('2021-10-01T12:00');
  
    async onModuleInit(){
        console.log("CAS 1 : ma maison consomme à cette date : ");
        await this.dateWhereHouseConsume();

        console.log("CAS 2 : ma maison ne consomme pas à cette date : ");
        await this.dateWhereHouseNotConsume();
    }

    async callToAPI(date:Date){
        await firstValueFrom(this.http.get(this.URL,{params:{date:date.toJSON()}})).then((body)=>{
            var consumption = body.data;
            console.log("A la date du "+date.toUTCString()+" ma maison consomme "+consumption);
        })
    }

    async dateWhereHouseConsume(){
        await this.callToAPI(this.consumeDate);
    }

    async dateWhereHouseNotConsume(){
        await this.callToAPI(this.notConsumeDate);
    }
}
