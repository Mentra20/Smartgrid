import { Injectable } from '@nestjs/common';

@Injectable()
export class GethouseurlService {
    public dict = new Object();
    public addHouseURL(ID:number,url:string):void{
        this.dict[ID]=url;
    }
    public getHouseURL(ID:number):string{
        return this.dict[ID];
        }
    
}
