import { Test, TestingModule } from '@nestjs/testing';
import { FromregistryController } from './fromregistry.controller';

describe('FromregistryController', () => {
  let controller: FromregistryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromregistryController],
    }).compile();

    controller = module.get<FromregistryController>(FromregistryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
