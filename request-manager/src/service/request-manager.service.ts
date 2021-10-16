import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RequestManagerService {
    private URL_DATASERVICE_REGISTRY =
    'http://client-database:3004/client-registry/community';
    private URL_GLOBAL_CONSUMPTION_MANAGER =
    'http://global-consumption-manager:3009/global-consumption';
    private URL_GLOBAL_PRODUCTION_MANAGER =
    'http://global-consumption-manager:3001/global-production/get-production';
    private URL_CONSUMPTION_DETAILED =
    'http://consumption-detailed:3008/get-detailed-consumption';       
  constructor(private http: HttpService) {}

  getHousesIDFromCommunityID(communityID: number) {
      var housesID=[]
    firstValueFrom(
      this.http.get(this.URL_DATASERVICE_REGISTRY, {
        params: { comunityID: communityID },
      }),
    ).then((body) => {
      const houses: any[] = body.data;
      houses.forEach((house) =>
          housesID.push(house.id),
      );
    });
    return housesID;
  }
  getTotalConsumptionFromCommunityID(date:string,housesID:any[]) {
  var TotalConsumption=0;
  firstValueFrom(
    this.http.get(this.URL_GLOBAL_CONSUMPTION_MANAGER+'/get-community-consumption', {
      params: {date:date,housesID:housesID},
    }),
  ).then((body) => {
    TotalConsumption = body.data
  });
  return TotalConsumption;
}
getTotalConsumptionFromHouseID(date:string,houseID:string) {
  var TotalConsumption=0;
  firstValueFrom(
    this.http.get(this.URL_GLOBAL_CONSUMPTION_MANAGER+'/get-house-consumption', {
      params: {date:date,houseID:houseID},
    }),
  ).then((body) => {
    TotalConsumption = body.data
  });
  return TotalConsumption;
}
getDetailedConsumption(dateString:string,houseID:string,objectName) {
  var TotalConsumption=0;
  firstValueFrom(
    this.http.get(this.URL_CONSUMPTION_DETAILED, {
      params: {date:dateString,houseID:houseID,objectName:objectName},
    }),
  ).then((body) => {
    TotalConsumption = body.data
  });
  return TotalConsumption;
}
getTotalConsumptionFromDate(date:string) {
  var TotalConsumption=0;
  firstValueFrom(
    this.http.get(this.URL_GLOBAL_CONSUMPTION_MANAGER+'/get-total-consumption', {
      params: {date:date},
    }),
  ).then((body) => {
    TotalConsumption = body.data
  });
  return TotalConsumption;
}
getTotalProductionDate(date:string) {
  var TotalProduction=0;
  firstValueFrom(
    this.http.get(this.URL_GLOBAL_PRODUCTION_MANAGER, {
      params : {date:date},
    }),
  ).then((body) => {
    TotalProduction = body.data
  });
  return TotalProduction;
}
}
