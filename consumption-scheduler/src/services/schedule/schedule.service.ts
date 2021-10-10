import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { endianness } from 'os';

@Injectable()
export class ScheduleService {
  private date: Date;

  setDate(dayDate: Date) {
    this.date = dayDate;
  }

  getSchedule(houseID: number, consumptionTime: number) {


    var dateStart = new Date(this.date);
    var dateEnd = new Date(this.date);
    console.log(`hour : ${dateEnd.getHours()} , addHour = ${consumptionTime}`)

    dateEnd.setTime(dateEnd.getTime() +consumptionTime*1000*60*60);
    console.log(dateStart)
    console.log(dateEnd)
    console.log(this.date)

    return {start:dateStart,end:dateEnd};
  }
}
