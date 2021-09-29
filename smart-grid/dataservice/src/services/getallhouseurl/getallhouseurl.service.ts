import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GetallhouseurlService {
    public dict = {};


    public addHouseURL(ID:number,url:string):void{
        this.dict[ID]=url;
        console.log(ID)
        console.log(url)
        console.log(this.dict)
    }
    public getHouseUrl(index:number):string {
        return this.dict[index];
    }

    public getAllhousesURL():string[]{
        var localStorageHouseURL = [];
        for(var key in this.dict) {
            localStorageHouseURL.push(this.dict[key]);
            console.log(this.dict[key]);
            }
            return localStorageHouseURL;
        }
}
