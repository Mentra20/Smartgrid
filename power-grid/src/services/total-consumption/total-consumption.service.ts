import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import {AxiosResponse} from "axios";

@Injectable()
export class TotalConsumptionService {
    
    private URL: string

    constructor(private httpService: HttpService) {
        this.URL = "http://house:3000/consumption";
    }

    public async callToAPI(URL: string): Promise<number>{
        var body = await firstValueFrom(this.httpService.get(URL));
 
        return body.data
    }

    getTotalConsumption(): number {
        var promise = this.callToAPI(this.URL);
        var cons:number;

        promise.then(
            (x)=>{
                cons = x.data;
            })
            .catch((error) =>{
                console.log(error);
                cons = 0;
            });
        return cons;
    }
    
}