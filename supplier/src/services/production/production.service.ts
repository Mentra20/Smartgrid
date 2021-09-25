import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ProductionService {
    private production: number;
    private URL: string;

    constructor(private http:HttpService) {
        this.production = 200;
        this.URL = "http://power-grid:3003/total-consumption"
    }

    verifyProductionVsConsumption(date:Date):Promise<boolean>{
        return firstValueFrom(this.http.get(this.URL, {params: {date:date}})).then((body)=>{
            var consumption = body.data;
            if(this.checkCorrectConsumption(consumption)){
                let message = "Consumption OK";
                console.log(message);
                return true;
            }
            else{
                let message = "Bad consumption, produce : "+this.production+", require : "+consumption;
                console.log(message);
                this.adaptProductionToConsumption(consumption);
                return false;
            }
        })
    }

    private checkCorrectConsumption(value:number):boolean{
        return value==this.production;
    }

    private adaptProductionToConsumption(value:number) {
        this.production = value;
        console.log("Production have been adapted, it is now : " + this.production + ".");
    }

    getProduction(): number{
        return this.production;
    }
}
