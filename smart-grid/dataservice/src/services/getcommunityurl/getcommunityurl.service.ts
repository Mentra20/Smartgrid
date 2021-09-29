import { Injectable } from '@nestjs/common';

@Injectable()
export class GetcommunityurlService {
    public dict = new Object();
    public addCommunityURL(ID:number,url:string):void{
        this.dict[ID]=url;
    }
    public getCommunityURL(ID:number):string[]{
        var localStorageCommunityURL:string[]
        for(var key in this.dict) {
            localStorageCommunityURL.push(this.dict[key]);
        return localStorageCommunityURL;
        }
    }
}
