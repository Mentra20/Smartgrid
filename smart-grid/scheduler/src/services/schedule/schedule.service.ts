import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  private schedule: Date[] = [];

  constructor() {
    this.schedule.push(new Date('2021-10-01T22:00'));
    this.schedule.push(new Date('2021-10-02T06:00'));
  }

  getSchedule(): Date[] {
    console.log('got called');
    return this.schedule;
  }
}
