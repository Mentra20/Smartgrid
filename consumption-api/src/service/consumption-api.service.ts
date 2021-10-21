import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConsumptionApiService {
  private URL_DATASERVICE_REGISTRY =
    'http://client-database:3004/client-registry/community';

  private URL_GLOBAL_CONSUMPTION_MANAGER =
    'http://global-consumption-database:3009/global-consumption';

  constructor(private http: HttpService) { }

  getHousesIDFromCommunityID(communityID: number):Promise<any[]> {
    return firstValueFrom(
      this.http.get(this.URL_DATASERVICE_REGISTRY, {
        params: { communityID: communityID },
      }),
    ).then((body) => {
      var housesID = []
      const houses: any[] = body.data;
      houses.forEach((house) =>
        housesID.push(house.id),
      );
      return housesID;
    });
  }

  getCommunityConsumption(date: string, housesID: any[]):Promise<number> {
    return firstValueFrom(
      this.http.get(this.URL_GLOBAL_CONSUMPTION_MANAGER + '/get-community-consumption', {
        params: { date: date, housesID: housesID },
      }),
    ).then((body) => {
      return body.data||0
    });
  }
  
  getTotalConsumption(date: string):Promise<number> {
    return firstValueFrom(
      this.http.get(this.URL_GLOBAL_CONSUMPTION_MANAGER + '/get-total-consumption', {
        params: { date: date },
      }),
    ).then((body) => {
      return body.data|| 0
    });
  }
}
