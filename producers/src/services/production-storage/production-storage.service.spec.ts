import { Test, TestingModule } from '@nestjs/testing';
import { ProductionStorageService } from './production-storage.service';

describe('ProductionStorageService', () => {
  let service: ProductionStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionStorageService],
    }).compile();

    service = module.get<ProductionStorageService>(ProductionStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
