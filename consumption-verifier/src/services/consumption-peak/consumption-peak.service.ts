import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionPeakService {
    private URL: string;
    private max_production: number;

    constructor(private http:HttpService) {
        this.max_production = 10000; //Valeur à modifier
        this.URL = "http://consumption-manager:3008/community-consumption";
    }

    verifyIfEnergyPeakExist(date:Date, ID:number): Promise<boolean>{
        return firstValueFrom(this.http.get(this.URL, {params: {date:date, ID:ID}})).then((body)=>{

            var community_consumption: number = body.data;
            
            if(this.checkConsumptionPeak(community_consumption)) {
                console.log("!! Consumption for community " + ID + " is at a PEAK !!");   
                return true;
            }
            else {
                console.log("Consumption for community " + ID + " is correct.");
                return false;
            }
        })
    }

    private checkConsumptionPeak(value:number):boolean {
        return value>=this.max_production;
    }
}
