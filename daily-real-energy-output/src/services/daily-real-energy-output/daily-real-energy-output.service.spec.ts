import { Test, TestingModule } from '@nestjs/testing';
import { DailyRealEnergyOutputService } from './daily-real-energy-output.service';

describe('DailyRealEnergyOutputService', () => {
  let service: DailyRealEnergyOutputService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyRealEnergyOutputService],
    }).compile();

    service = module.get<DailyRealEnergyOutputService>(DailyRealEnergyOutputService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
