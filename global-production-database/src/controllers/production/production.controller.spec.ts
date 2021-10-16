import { Test, TestingModule } from '@nestjs/testing';
import { GlobalProductionController } from './production.controller';

describe('GlobalProductionController', () => {
  let controller: GlobalProductionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalProductionController],
    }).compile();

    controller = module.get<GlobalProductionController>(GlobalProductionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
