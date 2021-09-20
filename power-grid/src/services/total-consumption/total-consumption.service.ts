import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TotalConsumptionService {
    
    private URL: string
    private consumption: number=-1;

    constructor(private httpService: HttpService) {
        this.URL = "http://house:3000/consumption";
    }

    public async callToAPI(URL: string){
        await firstValueFrom(this.httpService.get(URL)).then(body=>this.consumption = body.data);
    }

    async getTotalConsumption(): Promise<number> {
        this.consumption = -1;
        await this.callToAPI(this.URL);
        return this.consumption;
    }
    
}