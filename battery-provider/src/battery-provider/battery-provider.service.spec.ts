import { Test, TestingModule } from '@nestjs/testing';
import { BatteryProviderService } from './battery-provider.service';

describe('BatteryProviderService', () => {
  let service: BatteryProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatteryProviderService],
    }).compile();

    service = module.get<BatteryProviderService>(BatteryProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
