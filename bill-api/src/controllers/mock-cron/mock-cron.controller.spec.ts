import { Test, TestingModule } from '@nestjs/testing';
import { MockCronController } from './mock-cron.controller';

describe('MockCronController', () => {
  let controller: MockCronController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockCronController],
    }).compile();

    controller = module.get<MockCronController>(MockCronController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
