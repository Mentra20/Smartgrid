import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionCheckService {
    private URL_consumption_manager: string;
    private URL_supplier_get: string;
    private URL_supplier_change: string;

    constructor(private http:HttpService) {
        this.URL_consumption_manager = "http://consumption-manager:3008/total-consumption";
        this.URL_supplier_get = "http://supplier:3005/get-production";
        this.URL_supplier_change = "http://supplier:3005/change-production";
    }

    async verifyProductionVsConsumption(date:Date){
        var production = await this.getProductionValue(date);
        var consumption = await this.getTotalConsumption(date);

        if (this.checkCorrectConsumption(await consumption, await production)) {
            console.log("consumption is OK");
        } 
        else {
            console.log("bad consumption, produce : " + production + ", require : " + consumption);
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

    private productionNeedToChange(consumption:number) {
        return firstValueFrom(this.http.get(this.URL_supplier_change, {params: {consumption:consumption}})).then((body)=> {
            var new_production:number = body.data;  
            console.log("Adapt production to : " + new_production + ".");
        });
    }
}
