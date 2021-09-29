import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionCheckService {
    private URL_consumption_manager: string;
    private URL_supplier_get: string;
    private URL_supplier_change: string;

    constructor(private http:HttpService) {
        this.URL_consumption_manager = "http://consumption-manager:3014/total-consumption";
        this.URL_supplier_get = "http://supplier:3002/get-production";
        this.URL_supplier_change = "http://supplier:3002/change-production";
    }

    async verifyProductionVsConsumption(date:Date){
        var production = this.getProductionValue(date);
        var consumption = this.getTotalConsumption(date);

        if (this.checkCorrectConsumption(await consumption, await production)) {
            let message = "Consumption is OK";
            console.log(message);
        }
        else {
            let message = "Bad consumption, produce : " + production + ", require : " + consumption;
            console.log(message);
            this.productionNeedToChange(consumption);
        }

    }

    private checkCorrectConsumption(consumption:number, production:number):boolean{
        return consumption==production;
    }

    private getProductionValue(date:Date): Promise<number> {
        return firstValueFrom(this.http.get(this.URL_supplier_get, {params: {date:date}})).then((body)=>body.data)
    }

    private getTotalConsumption(date:Date): Promise<number> {
        return firstValueFrom(this.http.get(this.URL_consumption_manager, {params: {date:date}})).then((body)=>body.data)
    }

    private productionNeedToChange(consumption:Promise<number>) {
        return firstValueFrom(this.http.get(this.URL_supplier_change, {params: {number:consumption}})).then((body)=> {
            var new_production:number = body.data;  
            let value_message = "Value changed : " + new_production + ".";
            console.log(value_message);
        });
    }
}
