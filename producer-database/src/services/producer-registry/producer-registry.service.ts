import { Body, Get, Injectable, Post } from '@nestjs/common';
import { Producer } from 'src/models/Producer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProducerRegistryService {
    
    constructor(
        @InjectRepository(Producer)
        private producerRepository: Repository<Producer>){}

    async getProducer(producerID:string):Promise<Producer> {
        return await this.producerRepository.findOne(producerID);
    }

    async getAllProducers():Promise<Producer[]> {
        return await this.producerRepository.find();
    }

    async subscribeProducer(producerName:string):Promise<string> {
        return await this.generateProducerSubscription(producerName);
    }

    async updateProducerName(idProducer:string, newProducerName:string) {
        let producer = await this.producerRepository.findOne(idProducer);
        producer.id_company = newProducerName;

        await this.producerRepository.save(producer);

        console.log("Producer " + producer.id_producer + "'s name updated.\n");
        return;
    }

    private async generateProducerSubscription(producerName:string):Promise<string> {
        let producer = new Producer();
        producer.id_company = producerName;

        await this.producerRepository.save(producer);

        var ID_Producer = producer.id_producer;
        
        console.log("Saved " + producer.id_company + 
        " producer.\nID is " + producer.id_producer + ".");
        return ID_Producer;
    }
}

