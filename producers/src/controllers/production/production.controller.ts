import { Controller,Get, Query,Post,Param, Body, ParseFloatPipe } from '@nestjs/common';
import { ProductionServiceStorage} from 'src/services/production-storage/production-storage.service';

@Controller()
export class ProductionController {
    constructor(private readonly productionServiceStorage: ProductionServiceStorage) {}

    @Get('get-production')
    getProduction(@Query('producerID') producerID:string): number {
        console.log("[get-production][getProduction] => number")
        return this.productionServiceStorage.getProducer(producerID).currentProduction;
    }

    @Post('change-production')
    changeProductionAndReturnIt(@Body('producerID') producerID:string,@Body('adaptProduction') adaptProduction:number) {
        console.log("[change-production][changeProductionAndReturnIt] {producerID: "+producerID+"adaptProduction : "+adaptProduction+"} => number")
        this.productionServiceStorage.changeProduction(producerID,+adaptProduction);
    }

    @Get('get-production-limit')
    getProductionLimit(@Body('producerID') producerID:string): number {
        console.log("[get-production-limit][getProductionLimit] => number")
        return this.productionServiceStorage.getProducer(producerID).maxProduction
    }

    @Post('change-production-limit')
    changeProductionLimite(@Body('producerID') producerID:string,@Body("productionLimite",ParseFloatPipe) productionLimite:number) {
        console.log("[change-production-limit][changeProductionLimite]")
        this.productionServiceStorage.changeProductionLimit(producerID,productionLimite)
    }
    
    @Post('add-supplier')
    async addProducter(@Body('producerName') producerName:string,@Body('production') production:number): Promise<string> {
        console.log("[add-supplier][addProducter] production:number "+production+" => number")
        var newupplier = await this.productionServiceStorage.addSupplier(producerName,+production);
        return newupplier.producerID;
    }


    @Post('tick')
    doTick(@Body("date") dateString:string){
        console.log("[tick][doTick]  date:string" + dateString)
        this.productionServiceStorage.pushAllProduction(dateString);
    }
}
