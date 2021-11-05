import { AutarkyOversightService } from '../services/autarky-oversight.service';
import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AutarkyOversightController {
  constructor(
    private readonly autarkyOversightService: AutarkyOversightService,
    @Inject('AUTARKY-OVERSIGHT') private client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('energy.output.community');
    await this.client.connect();
    console.log('AutarkyOversight connected to the bus.');
  }

  @MessagePattern('energy.output.community')
  async processAutarkyCommunity(
    @Payload()
    realConsumptionCommunityMSG: any,
  ) {
    console.log(
      'received this message :' + JSON.stringify(realConsumptionCommunityMSG),
    );
    this.autarkyOversightService
      .processAutarkyCommunity(realConsumptionCommunityMSG.value)
      .forEach((message) => {
        console.log('message : \n', JSON.stringify(message));
        this.client.emit('client.notification', message);
      });
  }
}
