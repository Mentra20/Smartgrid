import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductionAdaptService {
    private URL_PRODUCERS_ADAPT = "http://producers:3005/change-production";

    constructor(private http:HttpService) {}

    adaptProduction(amountToAdd: any) {
        return firstValueFrom(this.http.get(this.URL_PRODUCERS_ADAPT, {params: {amountToAdd}})).then((body)=> {
            console.log("Production adapter told the producers to change their production.");
        });
    }
}
