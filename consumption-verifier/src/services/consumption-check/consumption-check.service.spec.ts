import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionCheckService } from './consumption-check.service';

describe('ConsumptionCheckService', () => {
  let service: ConsumptionCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumptionCheckService],
    }).compile();

    service = module.get<ConsumptionCheckService>(ConsumptionCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
