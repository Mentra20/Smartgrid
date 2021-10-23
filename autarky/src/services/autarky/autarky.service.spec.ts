import { Test, TestingModule } from '@nestjs/testing';
import { AutarkyService } from './autarky.service';

describe('AutarkyService', () => {
  let service: AutarkyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutarkyService],
    }).compile();

    service = module.get<AutarkyService>(AutarkyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
