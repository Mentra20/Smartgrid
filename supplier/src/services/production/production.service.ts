import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ProductionService {
    private production: number;

    constructor(private http:HttpService) {
        this.production = 200;
    }

    onModuleInit(){
        var EventSource = require("eventsource");
        var source = new EventSource('http://clock:3004/clock/tick');

        source.onmessage = ({ data }) => {
            console.log(data);
            this.verifyProductionVsConsumption(new Date(+data));
        }
    }

    private verifyProductionVsConsumption(date:Date){
        console.log(date);
        firstValueFrom(this.http.get("http://power-grid:3003/total-consumption")).then((body)=>{
            var consumption = body.data;
            if(this.checkCorrectConsumption(consumption)){
                console.log("Consumption OK");
            }
            else{
                console.log("Bad consumption, produce : "+this.production+", require : "+consumption);
            }
        }
        )

    }

    private checkCorrectConsumption(value:number):boolean{
        return value==this.production;
    }

    getProduction(): number{
        return this.production;
    }
}
