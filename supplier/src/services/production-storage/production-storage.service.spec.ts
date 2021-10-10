import { Test, TestingModule } from '@nestjs/testing';
import {ProductionServiceStorage} from './production-storage.service'

describe('ProductionStorageService', () => {
  let service: ProductionServiceStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionServiceStorage],
    }).compile();

    service = module.get<ProductionServiceStorage>(ProductionServiceStorage);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
