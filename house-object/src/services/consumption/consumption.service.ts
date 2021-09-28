import { Injectable } from '@nestjs/common';
import { TimeSlotsList } from 'src/models/time-slots';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionService {
  private objectName = 'voiture';
  private URL: string;

  private consumptionSlotList: TimeSlotsList = new TimeSlotsList();

  constructor(private http: HttpService) {
    this.URL = 'http://house:3000/schedule';
    this.consumptionSlotList.addSlots(
      new Date('2021-10-01T00:00'),
      new Date('2021-10-01T10:00'),
      500,
    );
  }

  getConsumption(date: Date): number {
    return this.consumptionSlotList.getConsumption(date);
  }

  getObjectName(): string {
    return this.objectName;
  }

  getSchedule(): Promise<string[]> {
    return firstValueFrom(this.http.get(this.URL)).then((body) => {
      this.consumptionSlotList.addSlots(
        new Date(body.data[0]),
        new Date(body.data[1]),
        500,
      );
      return body.data;
    });
  }
}
