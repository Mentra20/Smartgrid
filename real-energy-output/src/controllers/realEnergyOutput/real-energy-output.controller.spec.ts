import { Test, TestingModule } from '@nestjs/testing';
import { RealEnergyOutputController } from './real-energy-output.controller';

describe('GlobalConsumptionController', () => {
  let controller: RealEnergyOutputController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RealEnergyOutputController],
    }).compile();

    controller = module.get<RealEnergyOutputController>(RealEnergyOutputController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
