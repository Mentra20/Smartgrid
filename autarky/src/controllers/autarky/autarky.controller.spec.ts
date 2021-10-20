import { Test, TestingModule } from '@nestjs/testing';
import { AutarkyController } from './autarky.controller';

describe('GlobalConsumptionController', () => {
  let controller: AutarkyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutarkyController],
    }).compile();

    controller = module.get<AutarkyController>(AutarkyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
