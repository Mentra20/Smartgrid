import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class SubscriptionService {
    private URL_SubscribeClientDB = "http://client-database:3004/client-registry/subscribe";
    private URL_UpdateClientDB = "http://client-database:3004/client-registry/updateClientConnection";
    private URL_SubscribeProducerDB = "http://producer-database:3010/producer-registry/subscribe";
    private URL_UpdateProducerDB = "http://producer-database:3010/producer-registry/updateProducerName";

    constructor(private http:HttpService){}

    ID_Community = 1;
    nbHouseInCommunity = 0;

    async subscribeClient(clientName:string):Promise<string>{
        console.log("Client registred info : " + clientName);
        return this.generateClientSubscription(clientName);
    }

    async updateSubscription(idHouse:number, newClientName:string){
        var message = {idHouse, newClientName};

        await this.http.post(this.URL_UpdateClientDB, message).subscribe( {
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
   
    private async generateProducerSubscription(producerName: string):Promise<number> {
        var id_producer;

        this.http.post(this.URL_SubscribeProducerDB, producerName).subscribe(
            {
                next: (value) => {console.log("Data stored\n"); id_producer = value}, 
                error: (error) => console.log(error)
            }
        )
        
        return id_producer;
    }

    private async generateClientSubscription(clientName:string):Promise<string>{
        var community_ID = this.giveCommunityID();
        var message = {clientName, communityID:community_ID};
        var client_id = (await firstValueFrom(this.http.post(this.URL_SubscribeClientDB, message))).data;
        return client_id;
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
