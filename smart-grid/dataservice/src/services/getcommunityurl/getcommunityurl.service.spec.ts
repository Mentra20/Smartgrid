import { Test, TestingModule } from '@nestjs/testing';
import { GetcommunityurlService } from './getcommunityurl.service';

describe('GetcommunityurlService', () => {
  let service: GetcommunityurlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetcommunityurlService],
    }).compile();

    service = module.get<GetcommunityurlService>(GetcommunityurlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
