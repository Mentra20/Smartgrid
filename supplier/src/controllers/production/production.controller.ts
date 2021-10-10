import { Controller,Get, Query,Post,Param } from '@nestjs/common';
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
        return this.productionService.setProduction(consumption);
    }
    @Post('add-supplier')
    addProducter(@Param('producerName') producerName:string,@Param('production') production:number): number {
        console.log("[add-supplier][addProducter] consumption:number "+production+" => number")
        this.productionServiceStorage.addSupplier(producerName,production);
        return this.productionServiceStorage.getProducer(producerName).production;
    }
    @Post('push-production')
    PushProduction(@Param('producerName') producerName:string,@Param('date') date:string) {
        console.log("[push-production][pushProduction] producerName:string "+producerName+" date:string" + date)
        this.productionServiceStorage.pushProduction(producerName,date);
    }
    @Post('tick')
    doTick(@Param("date") dateString:string){
        console.log("[tick][doTick]  date:string" + dateString)
        this.productionServiceStorage.pushAllProduction(dateString);
    }
}
