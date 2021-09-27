import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionPeakService {
    private URL: string;
    private max_production: number;

    constructor(private http:HttpService) {
        this.max_production = 1000000; //Valeur à modifier
        this.URL = "http://consumption-manager:XXX/community-consumption";
    }

    verifyIfEnergyPeakExist(date:Date, community_id:number):Promise<boolean> {
        return firstValueFrom(this.http.get(this.URL, {params: {date:date}})).then((body)=>{
            var community_consumption = body.data;
            if(this.checkConsumptionPeak(community_consumption)) {
                let message = "!! Consumption for community " + community_id + " is at a PEAK !!";
                console.log(message);
                return true;
            }
            else {
                let message = "Consumption for community " + community_id + " is correct.";
                return false;
            }
        })
    }

    private checkConsumptionPeak(value:number):boolean {
        return value==this.max_production;
    }
}
