import { Test, TestingModule } from '@nestjs/testing';
import { AdaptConsumptionService } from './adapt-consumption.service';

describe('AdaptConsumptionService', () => {
  let service: AdaptConsumptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdaptConsumptionService],
    }).compile();

    service = module.get<AdaptConsumptionService>(AdaptConsumptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
