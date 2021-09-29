import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ScheduleService {
  private URL: string;
  private id: number;

  constructor(private http: HttpService) {
    this.URL = 'http://localhost:3002/schedule';
    this.id = 1;
  }

  getSchedule(): Promise<string[]> {
    return firstValueFrom(
      this.http.get(this.URL, { params: { ID: this.id } }),
    ).then((body) => {
      return body.data;
    });
  }
}
