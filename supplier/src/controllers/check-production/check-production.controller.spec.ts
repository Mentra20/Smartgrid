import { Test, TestingModule } from '@nestjs/testing';
import { CheckProductionController } from './check-production.controller';

describe('CheckProductionController', () => {
  let controller: CheckProductionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckProductionController],
    }).compile();

    controller = module.get<CheckProductionController>(CheckProductionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
