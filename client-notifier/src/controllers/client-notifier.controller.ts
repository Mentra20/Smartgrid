import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ClientNotifierController {
  constructor(@Inject('CLIENT-NOTIFIER') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('client.notification');
    await this.client.connect();
    console.log('ClientNotifier connected to the bus.');
  }

  @MessagePattern('client.notification')
  async processAutarkyFailedMessage(
    @Payload()
    autarkyChangeMSG: {
      type: string;
      id: any;
    },
  ) {
    console.log(
      'the ' +
        autarkyChangeMSG.type +
        ' of id ' +
        autarkyChangeMSG.id +
        'is not in autarky anymore',
    );
  }
}
