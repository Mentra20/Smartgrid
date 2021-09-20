import { Test, TestingModule } from '@nestjs/testing';
import { TotalConsumptionController } from './total-consumption.controller';

describe('TotalConsumptionController', () => {
  let controller: TotalConsumptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TotalConsumptionController],
    }).compile();

    controller = module.get<TotalConsumptionController>(TotalConsumptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
