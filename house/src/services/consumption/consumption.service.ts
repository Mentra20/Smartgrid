import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionService {
    private URL: string;

    constructor(private http:HttpService) {
        this.URL = "http://house-object:3001/consumption";
    }

    getConsumption(date:Date): Promise<number>{
        return firstValueFrom(this.http.get(this.URL,{params:{date:date.toJSON()}})).then((body)=>{
            return body.data.consumption;
        });
    }
}

