import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionPeakController } from './consumption-peak.controller';

describe('ConsumptionPeakController', () => {
  let controller: ConsumptionPeakController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionPeakController],
    }).compile();

    controller = module.get<ConsumptionPeakController>(ConsumptionPeakController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
