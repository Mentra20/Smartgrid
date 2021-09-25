import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class Scenario2Service {
    constructor(private http:HttpService){
        this.URL = "http://power-grid:3003/total-consumption";
    }

    URL:string;
    consumeDate:Date = new Date('2021-10-02T02:00');
    notConsumeDate:Date = new Date('2021-10-02T12:00');
  
    async onModuleInit(){
        await this.dateWhereHousesConsume();

        await this.dateWhereHousesNotConsume();
    }

    async callToAPI(date:Date){
        await firstValueFrom(this.http.get(this.URL,{params:{date:date.toJSON()}})).then((body)=>{
            var consumption = body.data;
            console.log("A la date du "+date.toUTCString()+" la somme de la consomation des maison est "+consumption);
        })
    }

    //TODO: Faire une moyenne des consommations des maisons
    async dateWhereHousesConsume(){
        console.log("CAS 1 : forte consommation des maisons : ");
        await this.callToAPI(this.consumeDate);
        console.log("=> Les clients consomment donc à cette heure-ci");
    }

    async dateWhereHousesNotConsume(){
        console.log("CAS 2 : faible consommation des maisons : ");
        await this.callToAPI(this.notConsumeDate);
        console.log("=> Les clients ne consomment donc pas à cette heure-ci");
    }
}
