import { Test, TestingModule } from '@nestjs/testing';
import { DailyRealEnergyOutputController } from './daily-real-energy-output.controller';

describe('DailyRealEnergyOutputController', () => {
  let controller: DailyRealEnergyOutputController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyRealEnergyOutputController],
    }).compile();

    controller = module.get<DailyRealEnergyOutputController>(DailyRealEnergyOutputController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
