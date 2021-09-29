import { Controller, Get, Query } from '@nestjs/common';
import { ConsumptionService } from '../../services/consumption/consumption.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ConsumptionService) {}

  @Get()
  getSchedule(): Promise<string[]> {
    return this.scheduleService.getSchedule();
  }
}
