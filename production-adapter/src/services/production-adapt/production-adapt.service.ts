import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductionAdapter } from '../../../src/production-adapter';
import { Repository} from 'typeorm';
@Injectable()
export class ProductionAdaptService {
    private URL_PRODUCERS_ADAPT = "http://producers:3005/change-production";

    constructor(private http:HttpService,
        @InjectRepository(ProductionAdapter)
        private ProductionAdapterRepository: Repository<ProductionAdapter>) {}

    adaptProduction(amountToAdd: any) {
        return firstValueFrom(this.http.get(this.URL_PRODUCERS_ADAPT, {params: {newProduction:amountToAdd}})).then((body)=> {
            console.log("Production adapter told the producers to change their production.");
        });
    }
    receiveProductionLimit(productionProducer:{id_producer:string,productionDate:Date,productionLimit:number,production:number}){
        let productionAdapter = new ProductionAdapter()
        productionAdapter.id_producer=productionProducer.id_producer;
        productionAdapter.productionDate=productionProducer.productionDate;
        productionAdapter.production=productionProducer.production;
        productionAdapter.productionLimit=productionProducer.productionLimit;
        this.ProductionAdapterRepository.save(productionAdapter);
        return (productionProducer.productionLimit>productionProducer.production)

    }

}
