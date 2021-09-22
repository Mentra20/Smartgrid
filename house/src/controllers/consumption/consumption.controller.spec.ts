import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionService } from 'src/services/consumption/consumption.service';
import { ConsumptionController } from './consumption.controller';

describe('ConsumptionController', () => {
  let service: ConsumptionService;
  let controller: ConsumptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionController],
      providers: [ConsumptionService],
    }).compile();

    service = module.get<ConsumptionService>(ConsumptionService);
    controller = module.get<ConsumptionController>(ConsumptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Have the correct consumption',()=>{
    expect(controller.getConsumption()).toEqual(service.getConsumption());
  })
});