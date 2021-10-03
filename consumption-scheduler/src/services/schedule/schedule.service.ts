import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {


  getSchedule(houseID: number): string[] {
    const schedule: string[] = [];
    if (houseID % 2 == 0) {
      schedule.push('2021-10-01T22:00');
      schedule.push('2021-10-02T04:00');
    } else {
      schedule.push('2021-10-02T02:00');
      schedule.push('2021-10-02T06:00');
    }
    return schedule;
  }
}
