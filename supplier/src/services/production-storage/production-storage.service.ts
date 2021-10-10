import { Injectable } from '@nestjs/common';
import { ProductionService } from 'src/services/production/production.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProductionServiceStorage {
    private URL_RegisteryManager = "http://registry-manager:3003/producerSubscribe";
    private URL_PUSH_PRODUCTION = "http://production-manager:3006/add-production"
    constructor(private http:HttpService){}
    dictProducter = {}

    getProducer(producerName:string){
        console.log("Production registred with info name : " + producerName);
        return this.dictProducter[producerName];
        }
    setProduction(newProduction:number){
        console.log("Production set with production value : " + newProduction);
        for(var key in this.dictProducter) {
            this.dictProducter[key]={id_societe:this.dictProducter[key].id_societe,productionDate:this.dictProducter[key].productionDate,production:newProduction};
            break;
            }
        }

    async addSupplier(producerName:string,production:number){
        var message = {producerName:producerName};
        var reponse;
        await this.http.post(this.URL_RegisteryManager,message).subscribe( {
            next: (value) => {console.log("Data updated.\n");
                                reponse=value;},
            error: (error) => console.log(error)
        })
        this.dictProducter[producerName]={id_producer:reponse,production:production};
        return reponse;
    }

    
    async pushProduction(producerName:string,date:string){
        var jsonProduction = {id_producer:this.dictProducter[producerName].id_producer,productionDate:new Date(date),production:this.dictProducter[producerName].production};
        this.http.post(this.URL_PUSH_PRODUCTION,{param:jsonProduction}).subscribe({
            next : (response)=> console.log(response),
            error : (error)=> console.error(error),
        })
    }
    async pushAllProduction(date:string){
        for(var key in this.dictProducter) {
            this.pushProduction(key,date);
        }
    }
}