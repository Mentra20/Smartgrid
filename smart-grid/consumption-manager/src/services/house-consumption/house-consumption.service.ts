import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HouseConsumptionService {
    private dataServiceURL: string

    constructor(private httpService: HttpService) {
        this.dataServiceURL = "http://DATASERVICE:3000/GETHOUSEURL";
    }

    public async callToHouseService(date:Date, houseURL:Promise<string>): Promise<number>{
        return firstValueFrom(this.httpService.get(await houseURL, {params: {date:date}})).then(body=>body.data);
    }

    public getHouseURLFromID(ID:number): Promise<string>{
        return firstValueFrom(this.httpService.get(this.dataServiceURL, {params: {ID:ID}})).then(body=>body.data);
    }

    getHouseConsumption(date:Date, houseID:number): Promise<number> {

        var houseURL = this.getHouseURLFromID(houseID);
        
        return this.callToHouseService(date, houseURL);
    }
}
