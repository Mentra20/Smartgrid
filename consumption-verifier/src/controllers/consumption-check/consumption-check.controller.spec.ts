import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionCheckController } from './consumption-check.controller';

describe('ConsumptionCheckController', () => {
  let controller: ConsumptionCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionCheckController],
    }).compile();

    controller = module.get<ConsumptionCheckController>(ConsumptionCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
