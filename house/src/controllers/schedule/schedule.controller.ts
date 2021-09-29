import { Controller,Get, Query } from '@nestjs/common';
import { ScheduleService } from 'src/services/schedule/schedule.service';

@Controller('schedule')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Get()
    getSchedule(): Promise<string[]> {
        return this.scheduleService.getSchedule();
    }
}
