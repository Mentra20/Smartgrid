import { Test, TestingModule } from '@nestjs/testing';
import { ProducerRegistryService } from './producer-registry.service';

describe('ProducerRegistryService', () => {
  let service: ProducerRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProducerRegistryService],
    }).compile();

    service = module.get<ProducerRegistryService>(ProducerRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
