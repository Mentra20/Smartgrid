import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscribeService {

    private subcriptionURI = "http://registry:3003/subscription" 

    private isSubscribe = false;

    constructor(private http: HttpService,private configService: ConfigService){}

    async onModuleInit(){
        const publicIp = require('public-ip');
        var ipv4 = await publicIp.v4();

        console.log("I go to subscribe with ip: "+ipv4+" and port: 3001")
        this.http.post(this.subcriptionURI,{params: {ip:ipv4,port:"3001"}}).subscribe({
            next:(x)=>{
                var ID_House = x.data.ID_House;
                var ID_Community = x.data.ID_Community;
                this.isSubscribe = true; 
                console.log("subscription ok")
                console.log("ID_House: "+ID_House)
                console.log("ID_Community: "+ID_Community)
            },
            error:(err)=>{this.isSubscribe = false; console.log("cannot connect to subscribre")}
        });
    }
}
