import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ScheduleService {
  private URL: string;

  constructor(private http: HttpService) {
    this.URL = 'http://localhost:3015/schedule';
  }


  getSchedule(): Promise<Date[]> {
    return firstValueFrom(this.http.get(this.URL)).then((body) => {
      return body.data;
    });
  }
}
