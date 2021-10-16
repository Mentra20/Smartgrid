import { Test, TestingModule } from '@nestjs/testing';
import { GlobalConsumptionController } from './global-consumption.controller';

describe('GlobalConsumptionController', () => {
  let controller: GlobalConsumptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalConsumptionController],
    }).compile();

    controller = module.get<GlobalConsumptionController>(GlobalConsumptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
