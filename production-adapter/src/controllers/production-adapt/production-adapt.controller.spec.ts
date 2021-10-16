import { Test, TestingModule } from '@nestjs/testing';
import { ProductionAdaptController } from './production-adapt.controller';

describe('ProductionAdaptController', () => {
  let controller: ProductionAdaptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionAdaptController],
    }).compile();

    controller = module.get<ProductionAdaptController>(ProductionAdaptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
