import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientConsumptionApiService {

  private URL_GLOBAL_CONSUMPTION_MANAGER =
    'http://global-consumption-database:3009/global-consumption';

  private URL_CONSUMPTION_DETAILED =
    'http://consumption-detailed:3008/get-detailed-consumption';
  constructor(private http: HttpService) { }


  getHouseGlobalConsumption(date: string, houseID: string):Promise<number> {
    return firstValueFrom(
      this.http.get(this.URL_GLOBAL_CONSUMPTION_MANAGER + '/get-house-consumption', {
        params: { date: date, houseID: houseID },
      }),
    ).then((body) => {
      if(body.data){
        return body.data.totalConsumption;
      }
    });
  }
  getHouseDetailedConsumption(dateString: string, houseID: string, objectName: string):Promise<number> {
    return firstValueFrom(
      this.http.get(this.URL_CONSUMPTION_DETAILED, {
        params: { date: dateString, houseID: houseID, objectName: objectName },
      }),
    ).then((body) => {
      return body.data||0
    });
  }


}
