import { Body, Controller, Post, Query } from '@nestjs/common';
import { AdaptConsumptionService } from 'src/services/adapt-consumption/adapt-consumption.service';

@Controller('adapt-consumption')
export class AdaptConsumptionController {
  constructor(
    private readonly adaptConsumptionService: AdaptConsumptionService,
  ) {}

  @Post()
  postAdaptConsumption(@Body('communityID') communityID: number) {
    this.adaptConsumptionService.postAdaptConsumption(communityID);
  }
}
