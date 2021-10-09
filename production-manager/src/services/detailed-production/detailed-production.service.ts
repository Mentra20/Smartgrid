import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class DetailedProductionService {

    constructor(
        private http:HttpService
    ){}

    public pushProduction(id_producer:string, productionDate:Date, production:number){
    
        var message = {id_producer:id_producer, productionDate:productionDate,production:production}
        this.http.post("http://production-db:3020/push-production", {param:message}).subscribe(
            {
                next: (value) => console.log("production send to ProductionDB") , 
                error: (error) => console.log(error)
            }
        )
    }
}
