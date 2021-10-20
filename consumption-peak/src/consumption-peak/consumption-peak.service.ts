import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ConsumptionPeakService {

    private URL_HOUSE_CLIENT_DB = "http://client-database:3004/client-registry/house";

    private peakLimit:number = 10000;

    private communityIDMap:Map<string,string>;

    constructor(@Inject("CONSUMPTION_PEAK") private client:ClientKafka,
        private http:HttpService){
            this.communityIDMap = new Map<string,string>();
        }

    public async checkPeak(consumptionFrame:{houseID:string,consumption:string}[]){
        var communityConsumptionMap = await this.constructCommunityMap(consumptionFrame); 
    
        communityConsumptionMap.forEach((value,key,map)=> {
            if(value > this.peakLimit){
                console.log("Consumption peak detect for communityID "+key+" with value "+value + " W.");
                this.emitPeakSignal(key);
            }
        });
    }

    public async constructCommunityMap(consumptionFrame:{houseID:string,consumption:string}[]):Promise<Map<string, number>>{
        var communityConsumption = new Map<string,number>();

        for(let clientCons of consumptionFrame){
            var currentCommunityID = await this.getCommunityIDFromHouseID(clientCons.houseID);

            //Already existing community consumption
            if(communityConsumption.has(currentCommunityID)){
                communityConsumption.set(
                    currentCommunityID, 
                    communityConsumption.get(currentCommunityID) + +clientCons.consumption);
            }
            else{//New community consumption
                communityConsumption.set(currentCommunityID, +clientCons.consumption);
            }
        }
        console.log("Construct map :"+communityConsumption);
        return communityConsumption;
    }

    public async getCommunityIDFromHouseID(houseID:string){
        var communityID:string;

        if(this.communityIDMap.has(houseID)){//In the cache
            communityID = this.communityIDMap.get(houseID);
            console.log("load client community ID from cache : "+communityID);
            return communityID;
        }
        else{ //Need to get info
            var clientInfo = await this.getClientInfoFromClientDB(houseID);
            console.log("get client info : "+JSON.stringify(clientInfo));
            communityID = clientInfo.id_community;

            //Add to cache
            this.communityIDMap.set(houseID, communityID);
            return communityID;
        }
    }

    public async getClientInfoFromClientDB(houseID:string){
        var clientInfo:{id:string,id_community:string,clientName:string} 
        = await firstValueFrom(
            this.http.get(this.URL_HOUSE_CLIENT_DB, {
              params: { houseID: houseID },
            }),
          ).then((response)=>response.data);
        return clientInfo;
    }

    public emitPeakSignal(communityID:string){
        var message = {communityID:communityID};
        console.log("Emit consumption peak for communityID : "+JSON.stringify(message));
        this.client.emit('consumption.peak',message);
    }
}
