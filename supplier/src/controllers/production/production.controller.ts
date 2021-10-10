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
    changeProductionAndReturnIt(@Query('consumption') consumption:number): number {
        console.log("[change-production][changeProductionAndReturnIt] consumption:number "+consumption+" => number")
        this.productionServiceStorage.setProduction(+consumption);
        return consumption;
    }
    @Post('add-supplier')
    async addProducter(@Body('producerName') producerName:string,@Body('production') production:number): Promise<number> {
        console.log("[add-supplier][addProducter] production:number "+production+" => number")
        await this.productionServiceStorage.addSupplier(producerName,+production);
        return this.productionServiceStorage.getProducer(producerName).id_producer;
    }
    @Post('push-production')
    PushProduction(@Body('producerName') producerName:string,@Body('date') date:string) {
        console.log("[push-production][pushProduction] producerName:string "+producerName+" date:string" + date)
        this.productionServiceStorage.pushProduction(producerName,date);
    }
    @Post('tick')
    doTick(@Body("date") dateString:string){
        console.log("[tick][doTick]  date:string" + dateString)
        this.productionServiceStorage.pushAllProduction(dateString);
    }
}
