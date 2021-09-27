import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TotalConsumptionService {
    private dataServiceURL: string

    constructor(private httpService: HttpService) {
        this.dataServiceURL = "http://DATASERVICE:3000/GETALLHOUSEURL";
    }

    public async getHouseConsumption(date:Date, houseURL:string): Promise<number>{
        return firstValueFrom(this.httpService.get(await houseURL, {params: {date:date}})).then(body=>body.data);
    }

    public getAllHousesURL(): Promise<string[]>{
        return firstValueFrom(this.httpService.get(this.dataServiceURL)).then(body=>body.data);
    }

    async getTotalConsumption(date:Date): Promise<number> {
        var consumptionSum = 0;
        var housesURL: Promise<string[]> = this.getAllHousesURL();
        
        await housesURL.then(
            (houses)=> houses.forEach(
                async (houseURL)=> consumptionSum += await this.getHouseConsumption(date, houseURL)
            ));

        return consumptionSum;
    }
}
