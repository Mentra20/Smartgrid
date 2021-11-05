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
    autarkyChangeMSG: {
      type: string;
      id: any;
    },
  ) {
    this.clientNotifierService.addMessage(autarkyChangeMSG);
    console.log(
      'the ' +
        autarkyChangeMSG.type +
        ' of id ' +
        autarkyChangeMSG.id +
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
