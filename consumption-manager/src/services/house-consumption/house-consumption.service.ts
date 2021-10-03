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
        console.log(houseURL+"/consumption/global")
        return firstValueFrom(this.httpService.get(await houseURL+"/consumption/global", {params: {date:date}})).then(body=>body.data);
    }

    public getHouseURLFromHouseID(ID:number): Promise<string>{
        console.log(this.dataServiceURL)
        return firstValueFrom(this.httpService.get(this.dataServiceURL, {params: {ID:ID}})).then(body=>body.data);
    }

    async getHouseConsumption(date:Date, houseID:number): Promise<number> {

        var houseURL = this.getHouseURLFromHouseID(houseID);
        var consumption = await this.callToHouseService(date, houseURL);

        console.log("house consumption is : "+consumption);

        return consumption;
    }
}
