import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError } from 'rxjs';

@Injectable()
export class SubscriptionService {
    private URL_SubscribeClientDB = "http://client-registry:3100/subscribe";
    private URL_UpdateClientDB = "http://client-registry:3100/updateClientConnection";
    private URL_SubscribeProducerDB = "http://producer-registry:3101/subscribe";
    private URL_UpdateProducerDB = "http://producer-registry:3101/updateProducerName";

    constructor(private http:HttpService){}

    ID_Community = 1;
    nbHouseInCommunity = 0;

    async subscribeClient(ip:string, port:string) {
        console.log("Client registred info : " + ip + ":" + port)
        var URL_House = "http://" + ip + ":" + port;
        await this.checkClientURL(URL_House);
        return await this.generateClientSubscription(URL_House);
    }

    async updateSubscription(idHouse:number, newIp:string, newPort:string){
        var URL_House = "http://" + newIp + ":" + newPort;

        await this.http.post(this.URL_UpdateClientDB, URL_House).subscribe( {
            next: (value) => console.log("Data updated.\n"),
            error: (error) => console.log(error)
        })
        return;
    }

    async subscribeProducer(producerName:string) {
        console.log("Producer registered info : " + producerName);
        return await this.generateProducerSubscription(producerName);
    }

    async updateProducerName(idProducer:number, newProducerName:string) {
        var message = {idProducer, newProducerName};
        await this.http.post(this.URL_UpdateProducerDB, message).subscribe({
            next: (value) => console.log("Data stored\n"),
            error: (error) => console.log(error)
        })
    }
   
    private async generateProducerSubscription(producerName: string) {
        this.http.post(this.URL_SubscribeProducerDB, producerName).subscribe(
            {
                next: (value) => console.log("Data stored\n"), 
                error: (error) => console.log(error)
            }
        )
    }
    
    private async checkClientURL(URL_House:string){
        await this.http.get(URL_House).pipe(
            catchError(e => {
                console.log("Bad IP.\n")
              throw new HttpException(e.response.data, e.response.status);
            })
        )
    }

    private async generateClientSubscription(URL_House:string){
        var community_ID = this.giveCommunityID();
        var message = {URL_House, community_ID};
        
        this.http.post(this.URL_SubscribeClientDB, message).subscribe(
            {
                next: (value) => console.log("Data stored\n"), 
                error: (error) => console.log(error)
            }
        )
    }

    private giveCommunityID():number {
        if (this.nbHouseInCommunity < 10) {
            this.nbHouseInCommunity++;
            return this.ID_Community;
        }
        else {
            this.ID_Community++;
            this.nbHouseInCommunity = 1;
            return this.ID_Community;
        }
    }
}
