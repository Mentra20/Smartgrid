import { Test, TestingModule } from '@nestjs/testing';
import { ProducerRegistryController } from './producer-registry.controller';

describe('ProducerRegistryController', () => {
  let controller: ProducerRegistryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerRegistryController],
    }).compile();

    controller = module.get<ProducerRegistryController>(ProducerRegistryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
