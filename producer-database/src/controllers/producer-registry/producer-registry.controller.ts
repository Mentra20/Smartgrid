import { Body, Controller, Get, Post } from '@nestjs/common';
import { Producer } from 'src/models/Producer';
import { ProducerRegistryService } from 'src/services/producer-registry/producer-registry.service';

@Controller('producer-registry')
export class ProducerRegistryController {
    
    constructor(private producerRegistryService: ProducerRegistryService) {}

    @Get("allProducers")
    getCommunity(): Promise<Producer[]> {
        return this.producerRegistryService.getAllProducers();
    }

    @Get("producer")
    getHouse(@Body("producerID") producerID:number): Promise<Producer> {
        return this.producerRegistryService.getProducer(producerID);
    }
    
    @Post("subscribe")
    producerSubscribe(@Body("producerName") producerName:string):Promise<number>{
        console.log("[producer-registry][producerSubscribe] producerName:string "+ producerName + "=> void");
        return this.producerRegistryService.subscribeProducer(producerName);
    }

    @Post("updateProducerName")
    updateName(@Body("idProducer") idProducer:number, @Body("newProducerName") newProducerName:string) {
        return this.producerRegistryService.updateProducerName(idProducer, newProducerName);
    }
}
