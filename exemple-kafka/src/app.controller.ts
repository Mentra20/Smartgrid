import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, Ctx, EventPattern, KafkaContext, MessagePattern, Payload, ServerKafka, Transport } from '@nestjs/microservices';
import { throws } from 'assert';
import { Server } from 'http';

@Controller()
export class AppController {



    constructor(@Inject("KAFKA_EXAMPLE") private client:ClientKafka){
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf("send.ok");

        this.client.subscribeToResponseOf("send.ok.reply");

        this.client.subscribeToResponseOf("emit.ok");

        await this.client.connect();
        console.log("im ready")
      }

    @Get("with-response")
    sendEvent() {
        console.log("I send message and want response")
        this.client.send('send.ok','my content').subscribe((result)=>console.log(result))
    }

    @Get("without-response")
    emitEvent() {
        console.log("I emit message")
        this.client.emit('emit.ok','aaaa.kill.dragon')
    }

    @Get("adder-test")
    adderTest() {
        console.log("I emit adder message")
        this.client.emit('consumption.raw.detailed',{houseID:"hello", consumptionDate:"pas parse de toute facon",
        object:[{objectName:"Mixeur", consumption:100},{objectName:"Frigo", consumption:500}]})
    }
    
    @MessagePattern("send.ok")
    withSend(@Payload() message: string) {
        console.log(`I receive the message kafka : ${JSON.stringify(message)}`);
        console.log("reply "+"my content response")
        return "my content response";
    }

    @MessagePattern("emit.ok")
    withEmit(@Payload() message: string) {
        console.log(`I receive the message kafka : ${JSON.stringify(message)}`);
        return "my content response";
    }

   
}
