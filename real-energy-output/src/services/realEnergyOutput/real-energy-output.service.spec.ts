import { Test, TestingModule } from '@nestjs/testing';
import { RealEnergyOutputService } from './real-energy-output.service';

describe('RealEnergyOutputService', () => {
  let service: RealEnergyOutputService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealEnergyOutputService],
    }).compile();

    service = module.get<RealEnergyOutputService>(RealEnergyOutputService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
