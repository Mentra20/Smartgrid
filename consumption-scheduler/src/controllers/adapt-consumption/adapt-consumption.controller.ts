import { Body, Controller, Inject, Post, Query } from '@nestjs/common';
import { AdaptConsumptionService } from 'src/services/adapt-consumption/adapt-consumption.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('adapt-consumption')
export class AdaptConsumptionController {
  constructor(
    private readonly adaptConsumptionService: AdaptConsumptionService,
    @Inject('CONSUMPTION_SCHEDULER') private client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('consumption.peak');
    await this.client.connect();

    console.log('consumption-scheduler connected on bus');
  }

  @MessagePattern('consumption.peak')
  postAdaptConsumption(@Payload() peakMSG: any) {
    console.log('community ayant un pic : ' + JSON.stringify(peakMSG.value));
    this.adaptConsumptionService.postAdaptConsumption(peakMSG.value.communityID);
  }
}
