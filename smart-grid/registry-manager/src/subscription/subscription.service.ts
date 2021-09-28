import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {

    idGenerator = 0;
    idGroupe = 0;

    subscribeClient(ip:string,port:string):{id:number,group:number}{
        console.log("new subscribe: "+ip+":"+port)
        //TODO send to dataManager
        return {id:this.idGenerator++ , group: this.idGroupe++};
    }
}
