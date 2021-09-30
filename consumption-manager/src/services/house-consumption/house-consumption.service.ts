import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HouseConsumptionService {
    private dataServiceURL: string

    constructor(private httpService: HttpService) {
        this.dataServiceURL = "http://dataservice:3006/fromregistry/gethouseurl";
    }

    public async callToHouseService(date:Date, houseURL:Promise<string>): Promise<number>{
        return firstValueFrom(this.httpService.get(await houseURL, {params: {date:date}})).then(body=>body.data);
    }

    public getHouseURLFromHouseID(ID:number): Promise<string>{
        return firstValueFrom(this.httpService.post(this.dataServiceURL, {params: {ID:ID}})).then(body=>body.data);
    }

    getHouseConsumption(date:Date, houseID:number): Promise<number> {

        var houseURL = this.getHouseURLFromHouseID(houseID);
        
        return this.callToHouseService(date, houseURL);
    }
}
