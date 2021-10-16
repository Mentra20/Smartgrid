import { Test, TestingModule } from '@nestjs/testing';
import { RequestManagerService } from './request-manager.service';

describe('RequestManagerService', () => {
  let service: RequestManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestManagerService],
    }).compile();

    service = module.get<RequestManagerService>(RequestManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
