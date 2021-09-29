import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GetallhouseurlService {
    public dict = new Object();
    public addHouseURL(ID:number,url:string):void{
        this.dict[ID]=url;
    }
    public getHouseUrl(index:number):string {
        return this.dict[index];
    }

    public getAllhousesURL():string[]{
        var localStorageHouseURL:string[]
        for(var key in this.dict) {
            localStorageHouseURL.push(this.dict[key]);
                return localStorageHouseURL;
            }
        }
}
