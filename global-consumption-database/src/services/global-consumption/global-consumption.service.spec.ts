import { Test, TestingModule } from '@nestjs/testing';
import { GlobalConsumptionService } from './global-consumption.service';

describe('GlobalConsumptionService', () => {
  let service: GlobalConsumptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalConsumptionService],
    }).compile();

    service = module.get<GlobalConsumptionService>(GlobalConsumptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
