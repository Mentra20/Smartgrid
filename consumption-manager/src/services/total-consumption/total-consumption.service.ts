import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TotalConsumptionService {
    private dataServiceURL: string

    constructor(private httpService: HttpService) {
        this.dataServiceURL = "http://dataservice:3006/fromregistry/getallhouseurl";
    }

    public async getHouseConsumption(date:Date, houseURL:string): Promise<number>{
        console.log(houseURL+"/consumption/global")
        return firstValueFrom(this.httpService.get(houseURL+"/consumption/global", {params: {date:date}})).then(body=>body.data);
    }

    public getAllHousesURL(): Promise<string[]>{
        return firstValueFrom(this.httpService.get(this.dataServiceURL)).then(body=>body.data);
    }

    async getTotalConsumption(date:Date): Promise<number> {
        var housesURL: string[] = await this.getAllHousesURL();
        
        var allConsumption = 0; 
        console.log(housesURL)
        for(const url of housesURL){
            console.log("url:"+url)
            var current = await this.getHouseConsumption(date,url);
            console.log("current : "+current)
            allConsumption+=current
        }
        return allConsumption;

    }
}
