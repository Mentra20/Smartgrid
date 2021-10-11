import { Controller, Get, Query } from '@nestjs/common';
import { ConsumptionPeakService } from 'src/services/consumption-peak/consumption-peak.service';

@Controller('consumption-peak')
export class ConsumptionPeakController {
  constructor(
    private readonly consumptionPeakService: ConsumptionPeakService,
  ) {}

  @Get()
  checkIfConsumptionPeakExist(
    @Query('date') dateString: Date,
    @Query('ID') communityID: number,
  ): Promise<any> {
    const date = dateString;
    const community_id = communityID;
    console.log(
      '[consumption-peak][checkIfConsumptionPeakExist] dateString:Date ' +
        dateString +
        ' ; communityID:number ' +
        communityID +
        ' => Promise<any>',
    );

    return this.consumptionPeakService.verifyIfEnergyPeakExist(
      date,
      community_id,
    );
  }
}
