import { Test, TestingModule } from '@nestjs/testing';
import { ProductionService } from 'src/services/production/production.service';
import { ProductionController } from './production.controller';

describe('ProductionController', () => {
  let service: ProductionService;
  let controller: ProductionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionController],
      providers: [ProductionService],
    }).compile();

    service = module.get<ProductionService>(ProductionService);
    controller = module.get<ProductionController>(ProductionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Have the correct production',()=>{
    expect(controller.getProduction()).toEqual(service.getProduction());
  })
});
