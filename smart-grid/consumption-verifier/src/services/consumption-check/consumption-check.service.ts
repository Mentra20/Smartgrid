import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionCheckService {
    private URL_consumption_manager: string;
    private URL_supplier: string;

    constructor(private http:HttpService) {
        this.URL_consumption_manager = "http://consumption-manager:XXX/total-consumption";
        this.URL_supplier = "http://supplier:3002/production";
    }

    verifyProductionVsConsumption(date:Date):boolean{
        var production = this.getProductionValue(date);
        var consumption = this.getTotalConsumption(date);

        if (this.checkCorrectConsumption(consumption, production)) {
            let message = "Consumption is OK";
            console.log(message);
            return true;
        }
        else {
            let message = "Bad consumption, produce : " + production + ", require : " + consumption;
            console.log(message);
            return false;
        }

    }

    private checkCorrectConsumption(consumption:number, production:number):boolean{
        return consumption==production;
    }

    private getProductionValue(date:Date): Promise<number> {
        return firstValueFrom(this.http.get(this.URL_supplier, {params: {date:date}})).then((body)=> {body.data})
    }

    private getTotalConsumption(date:Date): Promise<number> {
        return firstValueFrom(this.http.get(this.URL_consumption_manager, {params: {date:date}})).then((body)=>{body.data})
    }
}
