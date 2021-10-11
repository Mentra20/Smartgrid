import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionCheckService {
    private URL_consumption_manager: string;
    private URL_supplier_get: string;
    private URL_supplier_change: string;

    constructor(private http:HttpService) {
        this.URL_consumption_manager = "http://consumption-db:3009/get-total-consumption";
        this.URL_supplier_get = "http://production-db:3001/getproduction";
        this.URL_supplier_change = "http://supplier:3005/change-production";
    }

    async verifyProductionVsConsumption(date:Date): Promise<boolean>{
        var production = await this.getProductionValue(date);
        var consumption = await this.getTotalConsumption(date);

        if (this.checkCorrectConsumption(await consumption, await production)) {
            console.log("consumption is OK");
            return true;
        } 
        else {
            if (consumption>production){
            console.log("bad consumption, produce : " + production + ", require : " + consumption);
            this.productionNeedToChange(consumption-production);}//TODO attention au negative
            return false;
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
