import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { HouseEditorController } from './house-editor.controller';

describe('HouseEditorController', () => {
  let controller: HouseEditorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[AppModule],
    }).compile();

    controller = module.get<HouseEditorController>(HouseEditorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
