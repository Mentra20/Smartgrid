import { Test, TestingModule } from '@nestjs/testing';
import { ManageSchedulObjectController } from './manage-schedul-object.controller';

describe('ManageSchedulObjectController', () => {
  let controller: ManageSchedulObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManageSchedulObjectController],
    }).compile();

    controller = module.get<ManageSchedulObjectController>(ManageSchedulObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
