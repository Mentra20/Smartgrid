import { Injectable } from '@nestjs/common';


@Injectable()
export class GetallhouseurlService {
    public dictIdToUrl = {};
    public dictHouseToCommunity = {};

    public addHouseURL(ID:number,ID_Community:number,url:string):void{
        this.dictIdToUrl[ID]=url;
        this.dictHouseToCommunity[ID]= ID_Community;     
    }
    public getHouseUrl(index:number):string {
        return this.dictIdToUrl[index];
    }

    public getAllhousesURL():string[]{
        var localStorageHouseURL = [];
        for(var key in this.dictIdToUrl) {
            localStorageHouseURL.push(this.dictIdToUrl[key]);
            console.log(this.dictIdToUrl[key]);
            }
        return localStorageHouseURL;
        }


     public getAllhousesURLFromCommunityId(ID_Community:number):string[]{
        var localStorageHouseURL = [];
                for(var key in this.dictHouseToCommunity) {
                    if (this.dictHouseToCommunity[key]==ID_Community){
                        localStorageHouseURL.push(this.dictIdToUrl[key]);
                    }
            }
        return localStorageHouseURL;
        }
}
