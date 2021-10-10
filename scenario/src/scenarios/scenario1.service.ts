import { HttpService } from '@nestjs/axios';
import {Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class Scenario1Service {

    constructor(private http:HttpService){
        var request = require('request');

function doRequestPost({ url, form, method }) {
    return new Promise(function(resolve, reject) {
        request({ url, form, method }, function(error, res, body) {
            resolve({ error, res, body });
        });
    });
}

async function main() {
    var object = {
        param: [
            { id_producer: "lolo2", productionDate: "2021-10-02T02:00", production: 700 }
        ]
    };
    var response = await doRequestPost({ url: "http://localhost:3020/push-production", form: object, method: "POST" })
}

main();
        this.URL = "http://house:3000/consumption";
    }

    URL:string;
    consumeDate:Date = new Date('2021-10-02T02:00');
    notConsumeDate:Date = new Date('2021-10-01T12:00');
  
    async LaunchScenario(){
        await this.dateWhereHouseConsume();
        console.log("\n");
        await this.dateWhereHouseNotConsume();
    }

    async callToAPI(date:Date){
        await firstValueFrom(this.http.get(this.URL,{params:{date:date.toJSON()}})).then((body)=>{
            var consumption = body.data;
            console.log("Le "+date.toUTCString()+" ma maison consomme "+consumption);
        })
    }

    async dateWhereHouseConsume(){
        console.log("CAS 1 : ma maison consomme à cette date : ");
        await this.callToAPI(this.consumeDate);
    }

    async dateWhereHouseNotConsume(){
        console.log("CAS 2 : ma maison ne consomme pas à cette date : ");
        await this.callToAPI(this.notConsumeDate);
    }
}
