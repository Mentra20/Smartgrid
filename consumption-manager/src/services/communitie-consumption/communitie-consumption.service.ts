import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommunitieConsumptionService {
    private dataServiceURL: string

    constructor(private httpService: HttpService) {
        this.dataServiceURL = "http://dataservice:3006/fromregistry/getcommunityurl";
    }

    public async getHouseConsumption(date:Date, houseURL:string): Promise<number>{
        return firstValueFrom(this.httpService.get(houseURL+"/consumption/global", {params: {date:date}})).then(body=>body.data);
    }

    public getHousesURLFromCommunitieID(ID:number): Promise<string[]>{
        return firstValueFrom(this.httpService.get(this.dataServiceURL, {params: {ID}})).then(body=>body.data);
    }

    async getCommunitieConsumption(date:Date, communitieID:number): Promise<number> {
        var consumptionSum = 0;
        var housesURL: string[] = await this.getHousesURLFromCommunitieID(communitieID);
        
        console.log(housesURL);

        for(const url of housesURL){
            var current = await this.getHouseConsumption(date,url);
            console.log(current);
            consumptionSum+=current
        }
            
        console.log("community consumption is : "+consumptionSum);

        return consumptionSum;
    }
}
