import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscribeService {

    private subcriptionURI = "http://registry:3000/subscription"

    private isSubscribe = false;

    constructor(private http: HttpService,private configService: ConfigService){}

    onModuleInit(){
        console.log("i go to subscribe")
        this.http.post(this.subcriptionURI,{data: {port:"3000"}}).subscribe({
            next:(x)=>{this.isSubscribe = true; console.log("subscription ok")},
            error:(err)=>{this.isSubscribe = false; console.log("cannot connect to subscribre")}
        });
    }
}
