import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { timeStamp } from 'console';

@Injectable()
export class ConsumptionPeakService {
  private URL_consumption_community: string;
  private housesID: string[] = [];
  private URL_client_community: string;
  private URL_adapt_consumption: string;
  private max_production: number;

  constructor(private http: HttpService) {
    this.max_production = 5000; //Valeur à modifier
    this.URL_consumption_community =
      'http://consumption-detailed:3008/get-community-consumption';
    this.URL_client_community =
      'http://client-database:3004/client-registry/community';
    this.URL_adapt_consumption =
      'http://consumption-scheduler/3002/adapt-consumption';
  }

  async verifyIfEnergyPeakExist(
    date: Date,
    communityID: number,
  ): Promise<boolean> {
    await this.getCommunity(communityID);
    return await firstValueFrom(
      this.http.get(this.URL_consumption_community, {
        params: { date: date, housesID: this.housesID },
      }),
    ).then(async (body) => {
      const community_consumption: number = body.data;

      if (this.checkConsumptionPeak(community_consumption)) {
        console.log(
          '!! Consumption for community ' + communityID + ' is at a PEAK !!',
        );
        await this.adaptConsumption(communityID);
        return true;
      } else {
        console.log(
          'Consumption for community ' + communityID + ' is correct.',
        );
        return false;
      }
    });
  }

  private checkConsumptionPeak(value: number): boolean {
    return value >= this.max_production;
  }

  private async adaptConsumption(communityID: number) {
    await this.http.post(this.URL_adapt_consumption, communityID).subscribe({
      next: (value) => console.log('Consumption adapted.\n'),
      error: (error) => console.log(error),
    });
  }

  private async getCommunity(communityID: number) {
    return await firstValueFrom(
      this.http.get(this.URL_client_community, {
        params: { communityID: communityID },
      }),
    ).then((body) => {
      const community = body.data;

      for (const house of community) {
        this.housesID.push(house.id);
      }
    });
  }
}
