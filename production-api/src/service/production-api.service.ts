import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductionApiService {

  private URL_GLOBAL_PRODUCTION_MANAGER =
    'http://global-production-database:3001/global-production/get-production';

    private URL_DAILY_PRODUCTION =
    'http://daily-production-db:3014/daily-production';

  private URL_DETAILED_PRODUCTION_MANAGER =
    'http://global-production-database:3001/global-production/get-producer-production';

  constructor(private http: HttpService) { }
  
  getTotalProduction(date: string):Promise<number> {
    return firstValueFrom(
      this.http.get(this.URL_GLOBAL_PRODUCTION_MANAGER, {
        params: { date: date },
      })
    ).then((body) => {
      return body.data || 0
    });
  }

  getDetailedProduction(date: string, producerID:string):Promise<number> {
    return firstValueFrom(
      this.http.get(this.URL_DETAILED_PRODUCTION_MANAGER, {
        params: { date: date, producerID:producerID },
      })
    ).then((body) => {
      if(body.data){
        return body.data.production;
      }
    });
  }
  getDailyProduction(id_producer:string,productionDate:string) {
    return firstValueFrom(
      this.http.get(this.URL_DAILY_PRODUCTION+"/daily-production", {
        params: { id_producer: id_producer,productionDate:productionDate},
      }),
    ).then((body) => {
      return body.data||0 
    });
  }

    
  getPeriodProduction(id_producer:string,begin:string,end:string) {
    return firstValueFrom(
      this.http.get(this.URL_DAILY_PRODUCTION+"/period-production", {
        params: { id_producer: id_producer,begin:begin,end:end},
      }),
    ).then((body) => {
      return body.data||0
    });
  }
}
