import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { ProductionAdapter } from 'src/production-adapter';
@Injectable()
export class ProductionAdaptService {
    private URL_PRODUCERS_ADAPT = "http://producers:3005/change-production";
    constructor(private http:HttpService,
        @InjectRepository(ProductionAdapter)
        private ProductionAdapterRepository: Repository<ProductionAdapter>) {}
    
    findAll(): Promise<ProductionAdapter[]> {
        return this.ProductionAdapterRepository.find();
        }

    async sumDiffLimitProd(){
        let listLocalDiff = await this.findAll()
        let sumLimit=0
        let sumProd=0
        for (let pas = 0; pas < listLocalDiff.length; pas++) {
            sumLimit=sumLimit+listLocalDiff[pas].productionLimit
            sumProd=sumProd+listLocalDiff[pas].productionLimit
        }
        return sumLimit-sumProd
        
    }
    

    async adaptProduction(amountToAdd: any) {
        let diffLocal = await this.sumDiffLimitProd()
        if (diffLocal>amountToAdd){
            firstValueFrom(this.http.get(this.URL_PRODUCERS_ADAPT, {params: {newProduction:amountToAdd}})).then((body)=> {
                console.log("Production adapter told the producers to change their production.");
            });
            return -1
        }
        else {
            return diffLocal-amountToAdd
        }
        
    }
    saveProductionLimit(productionProducer:{id_producer:string,productionDate:Date,productionLimit:number,production:number}){
        let productionAdapter = new ProductionAdapter()
        productionAdapter.id_producer=productionProducer.id_producer;
        productionAdapter.productionDate=productionProducer.productionDate;
        productionAdapter.production=productionProducer.production;
        productionAdapter.productionLimit=productionProducer.productionLimit;
        this.ProductionAdapterRepository.save(productionAdapter);
    }

}
