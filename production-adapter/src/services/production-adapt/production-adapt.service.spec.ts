import { Test, TestingModule } from '@nestjs/testing';
import { ProductionAdaptService } from './production-adapt.service';

describe('ProductionAdaptService', () => {
  let service: ProductionAdaptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionAdaptService],
    }).compile();

    service = module.get<ProductionAdaptService>(ProductionAdaptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
