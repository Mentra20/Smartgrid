import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class ScheduleService {
  private date: Date;

  setDate(dayDate: Date) {
    this.date = dayDate;
  }

  getSchedule(houseID: number, consumptionTime: number): Date[] {
    const schedule: Date[] = [];
    const int = randomInt(0, 5);
    const date = this.date;
    this.date.setHours(date.getHours() + int);
    schedule.push(date);
    this.date.setHours(date.getHours() + consumptionTime);
    schedule.push(date);

    return schedule;
  }
}
