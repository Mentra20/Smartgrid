import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ClientNotifierService } from '../services/client-notifier.service';

@Controller('client-notifier')
export class ClientNotifierController {
  constructor(
    private readonly clientNotifierService: ClientNotifierService,
    @Inject('CLIENT-NOTIFIER') private client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('client.notification');
    await this.client.connect();
    console.log('ClientNotifier connected to the bus.');
  }

  @MessagePattern('client.notification')
  async processAutarkyFailedMessage(
    @Payload()
    autarkyChangeMSG: any,
  ) {
    const message: {
      type: string;
      id: any;
      autarky: boolean;
    } = autarkyChangeMSG.value;
    this.clientNotifierService.addMessage(message);
    console.log(
      'the ' +
        message.type +
        ' of id ' +
        message.id +
        'is not in autarky anymore',
    );
  }

  @Get('get-house-message')
  async getHouseMessage(@Query('clientID') clientID: string) {
    return this.clientNotifierService.getHouseMessage(clientID);
  }

  @Get('get-community-message')
  async getCommunityMessage(@Query('communityID') communityID: number) {
    return this.clientNotifierService.getCommunityMessage(communityID);
  }
}
