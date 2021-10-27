import { Controller,Get, Query,Post,Param, Body } from '@nestjs/common';
import { ProductionServiceStorage} from 'src/services/production-storage/production-storage.service';

@Controller()
export class ProductionController {
    constructor(private readonly productionServiceStorage: ProductionServiceStorage) {}

    @Get('get-production')
    getProduction(producerName:string): number {
        console.log("[get-production][getProduction] => number")
        return this.productionServiceStorage.getProducer(producerName).production;
    }

    @Get('change-production')
    changeProductionAndReturnIt(@Query('newProduction') newProduction:number) {
        console.log("[change-production][changeProductionAndReturnIt] consumption:number "+newProduction+" => number")
        this.productionServiceStorage.setProduction(+newProduction);
    }

    @Get('get-production-limit')
    getProductionLimit(producerName:string): number {
        console.log("[get-production-limit][getProductionLimit] => number")
        return this.productionServiceStorage.getProducerLimit(producerName).productionLimit;
    }

    @Get('change-production-limit')
    changeProductionLimitAndReturnIt(@Query('newProduction') newProductionLimit:number) {
        console.log("[change-production-limit][changeProductionLimitAndReturnIt] productionLimit:number "+newProductionLimit+" => number")
        this.productionServiceStorage.setProductionLimit(+newProductionLimit);
    }
    
    @Post('add-supplier')
    async addProducter(@Body('producerName') producerName:string,@Body('production') production:number): Promise<number> {
        console.log("[add-supplier][addProducter] production:number "+production+" => number")
        await this.productionServiceStorage.addSupplier(producerName,+production);
        return this.productionServiceStorage.getProducer(producerName).id_producer;
    }

    
    @Post('push-production')
    PushProduction(@Body('producerName') producerName:string,@Body('date') date:string) {
        console.log("[push-production][pushProduction] producerName:string "+producerName+" date:string " + date)
        this.productionServiceStorage.pushProduction(producerName,date);
    }

    @Post('push-production-limit')
    PushProductionLimit(@Body('producerName') producerName:string,@Body('date') date:string) {
        console.log("[push-production-limit][pushProductionLimit] producerName:string "+producerName+" date:string " + date)
        this.productionServiceStorage.pushProductionLimit(producerName,date);
    }

    @Post('tick')
    doTick(@Body("date") dateString:string){
        console.log("[tick][doTick]  date:string" + dateString)
        this.productionServiceStorage.pushAllProduction(dateString);
        this.productionServiceStorage.pushAllProductionLimit(dateString);
    }
}
