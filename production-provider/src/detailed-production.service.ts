import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';


@Injectable()
export class DetailedProductionService {

    constructor(
        @Inject("PRODUCTION_PROVIDER") private client:ClientKafka
    ){}

    async onModuleInit() {
        await this.client.connect();
        console.log("production-provider connected on bus")
    }

    public pushProduction(objectProduction:{
            id_producer:string, 
            productionDate:string, 
            production:number})
    {
        console.log("I emit global production : "+objectProduction);
        this.client.emit('production.raw.global',objectProduction);
    }
}
