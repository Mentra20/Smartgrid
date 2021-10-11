import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, Ctx, EventPattern, KafkaContext, MessagePattern, Payload, ServerKafka, Transport } from '@nestjs/microservices';
import { Server } from 'http';

@Controller()
export class AppController {



    constructor(@Inject("CONSUMPTION_ADDER") private client:ClientKafka){
        
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf('bbbb.kill.dragon');
        await this.client.connect();
        console.log("test")
      }

    @Get()
    sendEvent() {
        console.log("hello world")

        this.client.emit('bbbb.kill.dragon','aaaa.kill.dragon')
        console.log("hello world1")
    }
      

    @MessagePattern('bbbb.kill.dragon')
    killDragon(@Payload() message: string) {
        console.log(`message: ${JSON.stringify(message)}`);
    }

   
}
