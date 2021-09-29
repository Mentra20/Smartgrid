import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionPeakService } from './consumption-peak.service';

describe('ConsumptionPeakService', () => {
  let service: ConsumptionPeakService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumptionPeakService],
    }).compile();

    service = module.get<ConsumptionPeakService>(ConsumptionPeakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
