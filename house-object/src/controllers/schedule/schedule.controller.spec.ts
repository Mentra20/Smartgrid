import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ConsumptionService } from '../../services/consumption/consumption.service';

describe('ScheduleController', () => {
  let service: ConsumptionService;
  let controller: ScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [ConsumptionService],
    }).compile();

    service = module.get<ConsumptionService>(ConsumptionService);
    controller = module.get<ScheduleController>(ScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Have the correct schedule', () => {
    expect(controller.getSchedule()).toEqual(service.getSchedule());
  });
});
