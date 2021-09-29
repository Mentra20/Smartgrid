import { Test, TestingModule } from '@nestjs/testing';
import { GetallhouseurlService } from './getallhouseurl.service';

describe('GetallhouseurlService', () => {
  let service: GetallhouseurlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetallhouseurlService],
    }).compile();

    service = module.get<GetallhouseurlService>(GetallhouseurlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
