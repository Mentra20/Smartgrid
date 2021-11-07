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
        private productionAdapterRepository: Repository<ProductionAdapter>) {}

        async realAdaptNeed(adaptNeed:number){
            var producers = await this.productionAdapterRepository.find()
            var arrayProductionNotUpdate:ProductionAdapter[] = await producers.filter((elt)=>elt.lastProductionReceive!=undefined && elt.productionLimit!=undefined)
            var differenceNotUpdate = 0;
            for(var elt of arrayProductionNotUpdate){
                differenceNotUpdate+= (elt.lastProductionRequestToProducer?(elt.lastProductionRequestToProducer-elt.lastProductionReceive):0)
            }
            return adaptNeed-differenceNotUpdate;
        }
    
        async updateCurrentProduction(producerID:string,production:number){
            var producer = await this.productionAdapterRepository.findOne(producerID)
            if(producer==undefined){
                producer = new ProductionAdapter()
                producer.id_producer=producerID
                producer.productionLimit = undefined

            }
            if(!producer.lastProductionRequestToProducer){
                producer.lastProductionRequestToProducer= production
            }
            
            producer.lastProductionReceive=production
            await this.productionAdapterRepository.save(producer)
        }

        async updateProductionLimite(producerID:string,limit:number){
            var producer = await this.productionAdapterRepository.findOne(producerID)
            if(producer==undefined){
                producer = new ProductionAdapter()
                producer.id_producer=producerID
                producer.lastProductionRequestToProducer = undefined
                producer.lastProductionReceive=undefined

            }
            producer.productionLimit = limit
            await this.productionAdapterRepository.save(producer)


        }

        async increaseProduction(productionToIncrease:number){
            console.log("[increaseProduction] "+productionToIncrease)

            var producers:ProductionAdapter[] = await this.productionAdapterRepository.find()
            producers = await producers.filter((elt)=>elt.lastProductionReceive!=undefined && elt.productionLimit!=undefined).sort((a,b)=>a.lastProductionRequestToProducer-b.lastProductionRequestToProducer)
            for(var producer of producers){

                var maxIncreaseValue = Math.min(productionToIncrease,producer.productionLimit-producer.lastProductionRequestToProducer)
                var status = await this.pushChangeProduction(producer.id_producer,maxIncreaseValue)

                if(status==500){
                    this.productionAdapterRepository.remove(producer)
                }
                else{
                    producer.lastProductionRequestToProducer = producer.lastProductionRequestToProducer+maxIncreaseValue
                    await this.productionAdapterRepository.save(producer)
                    productionToIncrease-=maxIncreaseValue;
                }

            }
        }

        async decreaseProduction(productionToDecrease:number){
            console.log("[decreaseProduction] "+productionToDecrease)
            var producers:ProductionAdapter[] = await this.productionAdapterRepository.find()
            producers = await producers.filter((elt)=>elt.lastProductionReceive!=undefined && elt.productionLimit!=undefined).sort((a,b)=>b.lastProductionRequestToProducer-a.lastProductionRequestToProducer)
            for(var producer of producers){
                var maxDecreaseValue = Math.min(productionToDecrease,producer.lastProductionRequestToProducer)
                var status = await this.pushChangeProduction(producer.id_producer,-maxDecreaseValue)

                if(status==500){
                    this.productionAdapterRepository.remove(producer)
                }
                else{
                    producer.lastProductionRequestToProducer = producer.lastProductionRequestToProducer-maxDecreaseValue
                    await this.productionAdapterRepository.save(producer)
                    productionToDecrease-=maxDecreaseValue;
                    if(productionToDecrease==0){
                        return;
                    }
                }
            }
        }

        async pushChangeProduction(producerID:string,adaptProduction:number):Promise<number>{
            var message = {producerID,adaptProduction}
            console.log("[pushChangeProduction] params: "+JSON.stringify(message))
            return (await firstValueFrom(this.http.post(this.URL_PRODUCERS_ADAPT,message))).status;
            ;
        }
    


}
