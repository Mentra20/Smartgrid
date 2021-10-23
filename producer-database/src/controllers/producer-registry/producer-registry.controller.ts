import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Producer } from 'src/models/Producer';
import { ProducerRegistryService } from 'src/services/producer-registry/producer-registry.service';

@Controller('producer-registry')
export class ProducerRegistryController {
    
    constructor(private producerRegistryService: ProducerRegistryService) {}

    @Get("allProducers")
    getAllProducers(): Promise<Producer[]> {
        return this.producerRegistryService.getAllProducers();
    }

    @Get("producer")
    getProducer(@Query("producerID") producerID:string): Promise<Producer> {
        return this.producerRegistryService.getProducer(producerID);
    }
    
    @Post("subscribe")
    producerSubscribe(@Body("producerName") producerName:string):Promise<string>{
        console.log("[producer-registry][producerSubscribe] producerName:string "+ producerName + "=> Promise<String>");
        var reponse = this.producerRegistryService.subscribeProducer(producerName)
        return reponse;
    }

    @Post("updateProducerName")
    updateName(@Body("idProducer") idProducer:string, @Body("newProducerName") newProducerName:string) {
        return this.producerRegistryService.updateProducerName(idProducer, newProducerName);
    }
}
