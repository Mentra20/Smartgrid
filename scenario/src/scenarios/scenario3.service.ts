import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class Scenario3Service {
    private URL_CHECK_PROD = "http://supplier:3002/check-production";
    private URL_CURRENT_CONSUMPTION = "http://supplier:3002/production";
    private URL_GRID_TOTAL_CONSUMPTION = "http://power-grid:3003/total-consumption"

    

    constructor(private http:HttpService){
        
    }

    async LaunchScenarioSupplier(){
        await this.checkAdaptConsumption();
    }

    private async beforeScenario(){
        let noConsumptionDate = new Date('1999-11-11T11:11')
        //on adapte la production a une date ou la consomation est nulle
        await firstValueFrom(this.http.get(this.URL_CHECK_PROD,{params:{date:noConsumptionDate.toJSON()}}))
    }

    private async checkAdaptConsumption(){
        console.log("Cas 1: la production doit s'adapter")
        await this.beforeScenario();
        let highConsumptionDate = new Date('2021-10-02T02:00')
        //Check total consumption
        await firstValueFrom(this.http.get(this.URL_GRID_TOTAL_CONSUMPTION,{params:{date:highConsumptionDate.toJSON()}})).then((body)=>
        {
            console.log("La power grid a besoin de: "+body.data);
        });

        await firstValueFrom(this.http.get(this.URL_CURRENT_CONSUMPTION,{params:{date:highConsumptionDate.toJSON()}})).then((body)=>
        {
            console.log("La production actuelle est de: "+body.data);
        });

        await firstValueFrom(this.http.get(this.URL_CHECK_PROD,{params:{date:highConsumptionDate.toJSON()}})).then((body)=>
        {
            console.log("La production est suffisante: "+body.data);
        });

        await firstValueFrom(this.http.get(this.URL_CURRENT_CONSUMPTION,{params:{date:highConsumptionDate.toJSON()}})).then((body)=>
        {
            console.log("La production s'est adapté et produit maintenant: "+body.data);
        });

        await firstValueFrom(this.http.get(this.URL_CHECK_PROD,{params:{date:highConsumptionDate.toJSON()}})).then((body)=>
        {
            console.log("La production est donc suffisante: "+body.data);
        });
    }
}


