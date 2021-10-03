import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_PORT } from 'src/main';

@Injectable()
export class SubscribeService {

    private subcriptionURI = "http://registry-manager:3003/subscription" 

    private subscribeID = undefined;
    private subscribeCommunity = undefined;
    private isSubscribe = false;

    constructor(private http: HttpService,private configService: ConfigService){}

    async onModuleInit(){
        const publicIp = require('public-ip');
        var ipv4 = this.configService.get("IP")||await publicIp.v4();
        var port = this.configService.get("PORT") || DEFAULT_PORT;

        console.log("I'm going to subscribe with ip: "+ipv4+" and port: "+port)
        this.http.post(this.subcriptionURI,{ip:ipv4,port:port}).subscribe({
            next:(x)=>{
                var ID_House = x.data.ID_House;
                var ID_Community = x.data.ID_Community;

                console.log("subscription ok")
                console.log("ID_House: "+ID_House)
                console.log("ID_Community: "+ID_Community)

                this.isSubscribe = true; 
                this.subscribeID = ID_House;
                this.subscribeCommunity = ID_Community
            },
            error:(err)=>{this.isSubscribe = false; console.log("unable to connect to the subscription")}
        });
    }

    public getSubscribeID(){
        if(!this.isSubscribe){
            console.log("ERROR - No subscription");
            return undefined;
        }
        return this.subscribeID;
    }

    public getCommunityID(){
        if(!this.isSubscribe){
            console.log("ERROR - No subscription");
            return undefined;
        }
        return this.subscribeCommunity;
    }
}
