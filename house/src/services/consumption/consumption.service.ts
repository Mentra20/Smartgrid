import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionService {
    private URL: string;

    constructor(private http:HttpService) {
        this.URL = "http://house-object:3005/consumption";
    }

    getConsumption(): Promise<number>{
        var date:Date = new Date(2021,10,1);
        return firstValueFrom(this.http.get(this.URL,{data:date})).then((body)=>{
            return body.data.consumption;
        }
        );
    }
    
}

