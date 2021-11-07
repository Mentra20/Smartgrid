import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Producer } from 'src/classes/producer';

@Injectable()
export class ProductionServiceStorage {
    private URL_RegisteryManager = "http://registry-manager:3003/subscription/producerSubscribe";
    private URL_PUSH_PRODUCTION = "http://production-provider:3006/add-production"
    constructor(private http:HttpService){}
    dictProducer = {}

    getProducer(producerID:string):Producer{
        return this.dictProducer[producerID];
    }

    changeProduction(producerID:string,changeProduction:number){
        var producer:Producer = this.getProducer(producerID)
        if(producer==undefined){
            throw new Error("Cannot change production of undefine for id :"+producerID)
        }
        producer.changeProduction(changeProduction);
    }
    changeProductionLimit(producerID:string,changeProductionLimit:number){
        console.log(`[changeProductionLimit] producerID : ${producerID}, changeProductionLimit: ${changeProductionLimit}`)
        var producer:Producer = this.getProducer(producerID)
        if(this.getProducer(producerID)){
            throw new Error("Cannot change production limit of undefine for id :"+producerID)
        }
        producer.changeProductionLimit(changeProductionLimit);
        this.pushProductionLimit(producerID)
    }
    

    async addSupplier(producerName:string,production:number){
        var message = {producerName:producerName};
        var producerID = (await firstValueFrom(this.http.post(this.URL_RegisteryManager,message))).data;
        var newProducer = new Producer(producerName,production)
        newProducer.producerID = producerID
        this.dictProducer[producerID]=newProducer
        this.pushProductionLimit(producerID)
        return newProducer;
    }
    
    async pushProduction(producerID:string,date:string){
        var jsonProduction = {
            id_producer:producerID,
            productionDate:new Date(date),
            production:this.dictProducer[producerID].currentProduction
        };
        console.log("push to production provider : "+JSON.stringify(jsonProduction))
        this.http.post(this.URL_PUSH_PRODUCTION,{production:jsonProduction}).subscribe({
            next : (response)=> console.log(response.data),
            error : (error)=> console.error("error :("),
        })
    }
    
    async pushProductionLimit(producerID:string){
        var jsonProductionLimit = {id_producer:producerID,productionLimit:this.dictProducer[producerID].maxProduction};
        console.log("push limit to production provider : "+JSON.stringify(jsonProductionLimit))
        this.http.post(this.URL_PUSH_PRODUCTION+"-limit",{productionLimit:jsonProductionLimit}).subscribe({
            next : (response)=> console.log(response.data),
            error : (error)=> console.error("error :("),
        })
    }
    async pushAllProduction(date:string){
        for(var key in this.dictProducer) {
            this.pushProduction(key,date);
        }
    }
}