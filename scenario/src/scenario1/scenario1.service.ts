import { HttpService } from '@nestjs/axios';
import {Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class Scenario1Service {

    constructor(private http:HttpService){}

    desiredDate:Date = new Date('2021-10-02T02:00');

    onModuleInit(){
        var EventSource = require("eventsource");
        var source = new EventSource('http://clock:3004/clock/tick');

        source.onmessage = ({ data }) => {
            console.log(data);
            this.waitDesiredHour(new Date(data));
        }
    }

    waitDesiredHour(date:Date){
        if(this.isDesiredDate(date)){
            
        }
    }

    isDesiredDate(date:Date){
        return (date == this.desiredDate);
    }

    callToAPI(){
        firstValueFrom(this.http.get("http://house:3000/consumption")).then((body)=>{
            var consumption = body.data;
            console.log("A la date du "+this.desiredDate.toUTCString()+" ma maison consomme "+consumption);
        }
        )
    }
}
