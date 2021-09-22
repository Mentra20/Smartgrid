import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TotalConsumptionService {
    
    private URL: string

    constructor(private httpService: HttpService) {
        this.URL = "http://house:3000/consumption";
    }

    public callToAPI(URL: string): Promise<number>{
        new Date()
        return firstValueFrom(this.httpService.get(URL)).then(body=>body.data);;
    }

    getTotalConsumption(): Promise<number> {
        return this.callToAPI(this.URL);
    }
    
}