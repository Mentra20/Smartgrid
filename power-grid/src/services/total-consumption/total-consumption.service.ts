import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TotalConsumptionService {
    
    private URL: string

    constructor(private httpService: HttpService) {
        this.URL = "http://house:3000/consumption";
    }

    public callToAPI(date:Date): Promise<number>{
        return firstValueFrom(this.httpService.get(this.URL, {params: {date:date}})).then(body=>body.data);;
    }

    getTotalConsumption(date:Date): Promise<number> {
        return this.callToAPI(date);
    }
    
}