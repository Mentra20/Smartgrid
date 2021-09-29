import { Injectable } from '@nestjs/common';

@Injectable()
export class GetcommunityurlService {
    public dict = {};
    public addCommunityURL(ID:number,url:string):void{
        this.dict[ID]=url;
    }
    public getCommunityURL(ID:number):string[]{
        for(var key in this.dict) {
            var localStorageCommunityURL = [];
            localStorageCommunityURL.push(this.dict[key]);
            console.log(this.dict[key]);
        }
        return localStorageCommunityURL;
        
    }
}
