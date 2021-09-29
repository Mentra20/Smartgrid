import { Test, TestingModule } from '@nestjs/testing';
import { GethouseurlService } from './gethouseurl.service';

describe('GethouseurlService', () => {
  let service: GethouseurlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GethouseurlService],
    }).compile();

    service = module.get<GethouseurlService>(GethouseurlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
