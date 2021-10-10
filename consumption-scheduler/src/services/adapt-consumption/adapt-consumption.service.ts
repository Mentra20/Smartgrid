import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdaptConsumptionService {
  private URL_DATASERVICE_REGISTRY = 'url';
  private URL_HOUSE = 'url';
  constructor(private http: HttpService) {}

  postAdaptConsumption(communityID: number) {
    firstValueFrom(
      this.http.get(this.URL_DATASERVICE_REGISTRY, {
        params: { comunityID: communityID },
      }),
    ).then((body) => {
      const houses: any[] = body.data;
      houses.forEach((house) =>
        this.http.post(this.URL_HOUSE, { house: house }),
      );
    });
  }
}
