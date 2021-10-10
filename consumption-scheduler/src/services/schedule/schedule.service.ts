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

    var dateStart = new Date(this.date);
    schedule.push(dateStart);
    var dateEnd = new Date(this.date);
    console.log(`hour : ${dateEnd.getHours()} , addHour = ${consumptionTime}`)

    dateEnd.setTime(dateEnd.getTime() +consumptionTime*1000*60*60);
    schedule.push(dateEnd);
    console.log(dateStart)
    console.log(dateEnd)
    console.log(this.date)

    return schedule;
  }
}
