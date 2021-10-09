import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from 'src/services/schedule/schedule.service';
import { AdaptConsumptionController } from './adapt-consumption.controller';

describe('ScheduleController', () => {
  let service: ScheduleService;
  let controller: AdaptConsumptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdaptConsumptionController],
      providers: [ScheduleService],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    controller = module.get<AdaptConsumptionController>(
      AdaptConsumptionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Have the correct schedule', () => {
    expect(controller).toBeDefined();
  });
});
