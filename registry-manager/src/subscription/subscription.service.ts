import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError } from 'rxjs';

@Injectable()
export class SubscriptionService {
    private URL_DATASERVICE_REGISTRY = "http://data-service:3006/fromregistry"

    constructor(private http:HttpService){}

    IDCommunityCount = 0;
    IDHouseCount = 0;

    async subscribeClient(ip:string,port:string):Promise<{ ID_House: number; ID_Community: number; }>{
        console.log("new subscribe: "+ip+":"+port)
        var URL_House = "http://"+ip+":"+port;
        await this.checkURL(URL_House);
        return await this.generateSubscription(URL_House);
    }

    async updateSubscription(idHouse:number,newIp:string,newPort:string){
        var URL_House = "http://"+newIp+":"+newPort;
        var message = {ID_House:idHouse,URL_House}
        await this.http.post(this.URL_DATASERVICE_REGISTRY,{data : message})
        return;
    }

    
    private async checkURL(URL_House:string){
        await this.http.get(URL_House).pipe(
            catchError(e => {
                console.log("bad ip")
              throw new HttpException(e.response.data, e.response.status);
            })
        )
    }

    private async generateSubscription(URL_House:string){
        var ID_Community= this.IDCommunityCount++;
        var ID_House = this.IDHouseCount++;
        var message = {ID_Community, ID_House,URL_House}
        await this.http.post(this.URL_DATASERVICE_REGISTRY,{params : message})
        return {ID_House , ID_Community};
    }

}
