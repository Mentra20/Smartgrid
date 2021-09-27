import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ProductionService {
    private production: number;
    private URL: string;

    constructor(private http:HttpService) {
        this.production = 200;
        this.URL = "http://consumption-verifier:XXX/consumption-check";
    }

    checkIfProductionNeedsAdaptation(date:Date): Promise<boolean> {
        if (this.getIfConsumptionEqualsProduction(date)) {
            let message = "Production needs to be adapted to the consumption of the grid ASAP.";
            console.log(message);
            return true;
        }
        else {
            let message = "Production is equal to the consumption of the grid, you have nothing to worry about - yet.";
            console.log(message);
            return false;
        }
    }

    private getIfConsumptionEqualsProduction(date:Date): Promise<boolean> {
        return firstValueFrom(this.http.get(this.URL, {params: {date:date}})).then((body)=> {body.data});
    }

    /*private adaptProductionToConsumption(value:number) {
        this.production = value;
        console.log("Production have been adapted, it is now : " + this.production + ".");
    }*/

    getProduction(): number{
        return this.production;
    }
}
