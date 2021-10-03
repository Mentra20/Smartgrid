import { Controller, Get, Query } from '@nestjs/common';
import { ScheduleService } from 'src/services/schedule/schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getSchedule(@Query('ID') houseID: number): string[] {
    console.log("[schedule][getSchedule] houseID:number "+ houseID + " => string[]");
        
    return this.scheduleService.getSchedule(houseID);
  }
}
