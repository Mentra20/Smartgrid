import { Test, TestingModule } from '@nestjs/testing';
import { TotalConsumptionService } from './total-consumption.service';

describe('TotalConsumptionService', () => {
  let service: TotalConsumptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TotalConsumptionService],
    }).compile();

    service = module.get<TotalConsumptionService>(TotalConsumptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
